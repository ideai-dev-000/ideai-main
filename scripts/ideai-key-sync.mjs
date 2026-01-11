#!/usr/bin/env node

/**
 * @fileoverview IdeaI Key Sync Script
 * 
 * @description
 * CLI tool for syncing API keys between local .env and database.
 * Usage:
 *   pnpm key-sync pull    # Sync from DB to local .env
 *   pnpm key-sync push    # Sync from local .env to DB
 *   pnpm key-sync validate # Check if local matches DB
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const command = process.argv[2];
const options = {
  envFile: process.argv.find((arg) => arg.startsWith("--env="))?.split("=")[1],
  apiUrl: process.argv.find((arg) => arg.startsWith("--api="))?.split("=")[1] ||
          process.env.IDEAI_KEY_SYNC_API_URL ||
          "http://localhost:3018/api/user-keys",
  userId: process.argv.find((arg) => arg.startsWith("--user="))?.split("=")[1],
  dryRun: process.argv.includes("--dry-run"),
};

const SERVICE_TYPES = ["ai_gateway", "openai", "v0", "anthropic", "firecrawl", "exa"];
const SERVICE_TO_ENV = {
  ai_gateway: "AI_GATEWAY_API_KEY",
  openai: "OPENAI_API_KEY",
  v0: "V0_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  firecrawl: "FIRECRAWL_API_KEY",
  exa: "EXA_API_KEY",
};

function hashKey(key) {
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}

async function parseEnvFile(envPath) {
  if (!existsSync(envPath)) {
    return {};
  }

  const content = await readFile(envPath, "utf-8");
  const keys = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      keys[match[1]] = value;
    }
  }

  return keys;
}

async function writeEnvFile(envPath, keys, preserveExisting = true) {
  const existing = preserveExisting ? await parseEnvFile(envPath) : {};
  const merged = { ...existing, ...keys };

  let content = "# IdeaI Service Keys (Auto-synced with Database)\n";
  content += "# DO NOT manually edit keys that start with AI_GATEWAY, OPENAI, etc.\n";
  content += "# Use 'pnpm key-sync pull' to sync from database\n\n";

  const serviceKeys = Object.keys(merged)
    .filter((k) => k.includes("API_KEY") || k.includes("GATEWAY"))
    .sort();
  
  for (const key of serviceKeys) {
    content += `${key}="${merged[key]}"\n`;
  }

  const otherKeys = Object.keys(merged)
    .filter((k) => !serviceKeys.includes(k))
    .sort();

  if (otherKeys.length > 0) {
    content += "\n# Other environment variables\n";
    for (const key of otherKeys) {
      content += `${key}="${merged[key]}"\n`;
    }
  }

  await writeFile(envPath, content, "utf-8");
}

async function getUserId() {
  if (options.userId) {
    return options.userId;
  }

  const envPath = options.envFile || ".env.local";
  if (existsSync(envPath)) {
    const content = await readFile(envPath, "utf-8");
    const match = content.match(/IDEAI_USER_ID=(.+)/);
    if (match) {
      return match[1].replace(/["']/g, "").trim();
    }
  }

  throw new Error(
    "User ID required. Set IDEAI_USER_ID in .env.local or use --user=USER_ID"
  );
}

async function syncFromDb() {
  const userId = await getUserId();
  const envPath = options.envFile || ".env.local";
  const synced = [];
  const missing = [];
  const errors = [];

  try {
    const response = await fetch(`${options.apiUrl}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const data = await response.json();
    const dbKeys = {};

    for (const serviceKey of data.keys || []) {
      const envVar = SERVICE_TO_ENV[serviceKey.serviceType];
      if (serviceKey.key && envVar) {
        dbKeys[envVar] = serviceKey.key;
        synced.push(serviceKey.serviceType);
      } else {
        missing.push(serviceKey.serviceType);
      }
    }

    if (!options.dryRun && Object.keys(dbKeys).length > 0) {
      await writeEnvFile(envPath, dbKeys);
      console.log(`✅ Synced ${synced.length} keys to ${envPath}`);
    }

    return { synced, missing, errors };
  } catch (error) {
    errors.push(error.message || "Unknown error");
    return { synced, missing, errors };
  }
}

async function syncToDb() {
  const userId = await getUserId();
  const envPath = options.envFile || ".env.local";
  const synced = [];
  const errors = [];

  if (!existsSync(envPath)) {
    errors.push(`.env file not found: ${envPath}`);
    return { synced, errors };
  }

  const envKeys = await parseEnvFile(envPath);

  for (const [serviceType, envVar] of Object.entries(SERVICE_TO_ENV)) {
    const key = envKeys[envVar];
    if (!key) continue;

    try {
      const response = await fetch(options.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          key,
          environment: "local",
        }),
      });

      if (response.ok) {
        synced.push(serviceType);
      } else {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        errors.push(`${serviceType}: ${error.error || response.statusText}`);
      }
    } catch (error) {
      errors.push(`${serviceType}: ${error.message || "Unknown error"}`);
    }
  }

  return { synced, errors };
}

async function validateSync() {
  const userId = await getUserId();
  const envPath = options.envFile || ".env.local";
  const matches = [];
  const mismatches = [];
  const missingLocal = [];
  const missingDb = [];
  const errors = [];

  const envKeys = existsSync(envPath) ? await parseEnvFile(envPath) : {};

  try {
    const response = await fetch(`${options.apiUrl}/hashes?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch key hashes: ${response.statusText}`);
    }

    const data = await response.json();
    const dbHashes = new Map();

    for (const item of data.hashes || []) {
      dbHashes.set(item.serviceType, item.hash);
    }

    for (const [serviceType, envVar] of Object.entries(SERVICE_TO_ENV)) {
      const localKey = envKeys[envVar];
      const dbHash = dbHashes.get(serviceType);

      if (!localKey && !dbHash) continue;

      if (!localKey) {
        missingLocal.push(serviceType);
      } else if (!dbHash) {
        missingDb.push(serviceType);
      } else {
        const localHash = hashKey(localKey);
        if (localHash === dbHash) {
          matches.push(serviceType);
        } else {
          mismatches.push(serviceType);
        }
      }
    }
  } catch (error) {
    errors.push(error.message || "Unknown error");
  }

  return { matches, mismatches, missingLocal, missingDb, errors };
}

async function main() {
  try {
    switch (command) {
      case "pull":
        console.log("📥 Pulling keys from database to local .env...");
        const pullResult = await syncFromDb();
        console.log(`✅ Synced: ${pullResult.synced.join(", ") || "none"}`);
        if (pullResult.missing.length > 0) {
          console.log(`⚠️  Missing: ${pullResult.missing.join(", ")}`);
        }
        if (pullResult.errors.length > 0) {
          console.error(`❌ Errors: ${pullResult.errors.join(", ")}`);
        }
        break;

      case "push":
        console.log("📤 Pushing keys from local .env to database...");
        const pushResult = await syncToDb();
        console.log(`✅ Synced: ${pushResult.synced.join(", ") || "none"}`);
        if (pushResult.errors.length > 0) {
          console.error(`❌ Errors: ${pushResult.errors.join(", ")}`);
        }
        break;

      case "validate":
        console.log("🔍 Validating key sync...");
        const validation = await validateSync();
        console.log(`✅ Matches: ${validation.matches.join(", ") || "none"}`);
        if (validation.mismatches.length > 0) {
          console.warn(`⚠️  Mismatches: ${validation.mismatches.join(", ")}`);
        }
        if (validation.missingLocal.length > 0) {
          console.warn(`⚠️  Missing locally: ${validation.missingLocal.join(", ")}`);
        }
        if (validation.missingDb.length > 0) {
          console.warn(`⚠️  Missing in DB: ${validation.missingDb.join(", ")}`);
        }
        if (validation.errors.length > 0) {
          console.error(`❌ Errors: ${validation.errors.join(", ")}`);
        }

        if (
          validation.mismatches.length === 0 &&
          validation.missingLocal.length === 0 &&
          validation.missingDb.length === 0
        ) {
          console.log("✅ All keys are in sync!");
          process.exit(0);
        } else {
          console.log("❌ Keys are out of sync. Run 'pnpm key-sync pull' to fix.");
          process.exit(1);
        }
        break;

      default:
        console.log(`
IdeaI Key Sync Tool

Usage:
  pnpm key-sync pull              Sync keys from database to local .env
  pnpm key-sync push              Sync keys from local .env to database
  pnpm key-sync validate          Validate that local keys match database

Options:
  --env=PATH        Path to .env file (default: .env.local)
  --api=URL         API URL (default: http://localhost:3018/api/user-keys)
  --user=USER_ID    User ID (or set IDEAI_USER_ID in .env)
  --dry-run         Show what would be done without making changes

Examples:
  pnpm key-sync pull --user=abc123
  pnpm key-sync validate
  pnpm key-sync push --env=.env.local
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    process.exit(1);
  }
}

main();
