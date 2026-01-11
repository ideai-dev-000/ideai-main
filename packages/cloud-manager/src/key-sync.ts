/**
 * @fileoverview Key Sync Manager
 *
 * @module KeySyncManager
 * @description
 * Syncs API keys between local .env file and database/user keys.
 * Uses secure hashing to compare keys without exposing them.
 * Ensures local development keys always match cloud/DB keys.
 */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type ServiceType =
  | "ai_gateway"
  | "openai"
  | "v0"
  | "anthropic"
  | "firecrawl"
  | "exa";

export interface KeySyncConfig {
  userId: string;
  envFilePath?: string;
  dbApiUrl?: string; // URL to call DB API (e.g., http://localhost:3018/api/user-keys)
  dryRun?: boolean;
}

/**
 * Generate a secure hash/fingerprint of a key for comparison
 * This allows comparing keys without storing the actual key
 */
export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex").slice(0, 16); // 16-char fingerprint
}

/**
 * Parse .env file and extract API keys
 */
async function parseEnvFile(envPath: string): Promise<Record<string, string>> {
  if (!existsSync(envPath)) {
    return {};
  }

  const content = await readFile(envPath, "utf-8");
  const keys: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      const key = match[1];
      let value = match[2];

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      keys[key] = value;
    }
  }

  return keys;
}

/**
 * Write keys to .env file
 */
async function writeEnvFile(
  envPath: string,
  keys: Record<string, string>,
  preserveExisting: boolean = true,
): Promise<void> {
  const existing = preserveExisting ? await parseEnvFile(envPath) : {};
  const merged = { ...existing, ...keys };

  let content = "# IdeaI Service Keys (Auto-synced with Database)\n";
  content +=
    "# DO NOT manually edit keys that start with AI_GATEWAY, OPENAI, etc.\n";
  content += "# Use 'pnpm key-sync' to sync from database\n\n";

  // Add service keys (sorted)
  const serviceKeys = Object.keys(merged)
    .filter((k) => k.includes("API_KEY") || k.includes("GATEWAY"))
    .sort();

  for (const key of serviceKeys) {
    content += `${key}="${merged[key]}"\n`;
  }

  // Add other keys
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

/**
 * Map service type to env var name
 */
function serviceToEnvVar(serviceType: ServiceType): string {
  const mapping: Record<ServiceType, string> = {
    ai_gateway: "AI_GATEWAY_API_KEY",
    openai: "OPENAI_API_KEY",
    v0: "V0_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    firecrawl: "FIRECRAWL_API_KEY",
    exa: "EXA_API_KEY",
  };
  return mapping[serviceType];
}

/**
 * Fetch user keys from database API
 */
async function fetchUserKeys(
  userId: string,
  apiUrl: string,
): Promise<Map<ServiceType, { key: string; hash: string }>> {
  try {
    const response = await fetch(`${apiUrl}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch keys: ${response.statusText}`);
    }

    const data = await response.json();
    const keys = new Map<ServiceType, { key: string; hash: string }>();

    // Note: This assumes the API can return keys (requires auth or special endpoint)
    // In production, we'd use server-side API that decrypts keys
    if (data.keys) {
      for (const keyInfo of data.keys) {
        // We'd need the actual key to hash it, but API doesn't return decrypted keys
        // So we'd need a special sync endpoint
        keys.set(keyInfo.serviceType as ServiceType, {
          key: "", // Will be fetched from sync endpoint
          hash: hashKey(""), // Placeholder
        });
      }
    }

    return keys;
  } catch (error) {
    console.error("Failed to fetch user keys:", error);
    return new Map();
  }
}

/**
 * Sync keys from database to local .env
 * Downloads keys from DB and updates local .env file
 */
export async function syncKeysFromDb(config: KeySyncConfig): Promise<{
  synced: ServiceType[];
  missing: ServiceType[];
  errors: string[];
}> {
  const envPath = config.envFilePath || join(process.cwd(), ".env.local");
  const synced: ServiceType[] = [];
  const missing: ServiceType[] = [];
  const errors: string[] = [];

  if (!config.dbApiUrl) {
    throw new Error("dbApiUrl required for syncing from database");
  }

  // Fetch keys from database sync endpoint
  // This endpoint would decrypt and return keys for sync (requires secure auth)
  try {
    const response = await fetch(`${config.dbApiUrl}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: config.userId }),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const data = await response.json();
    const dbKeys: Record<string, string> = {};

    for (const serviceKey of data.keys || []) {
      const envVar = serviceToEnvVar(serviceKey.serviceType as ServiceType);
      if (serviceKey.key) {
        dbKeys[envVar] = serviceKey.key;
        synced.push(serviceKey.serviceType as ServiceType);
      } else {
        missing.push(serviceKey.serviceType as ServiceType);
      }
    }

    if (!config.dryRun && Object.keys(dbKeys).length > 0) {
      await writeEnvFile(envPath, dbKeys);
      console.log(`✅ Synced ${synced.length} keys to ${envPath}`);
    }

    return { synced, missing, errors };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown error");
    return { synced, missing, errors };
  }
}

/**
 * Sync keys from local .env to database
 * Uploads local keys to DB (encrypted)
 */
export async function syncKeysToDb(config: KeySyncConfig): Promise<{
  synced: ServiceType[];
  errors: string[];
}> {
  const envPath = config.envFilePath || join(process.cwd(), ".env.local");
  const synced: ServiceType[] = [];
  const errors: string[] = [];

  if (!existsSync(envPath)) {
    errors.push(`.env file not found: ${envPath}`);
    return { synced, errors };
  }

  if (!config.dbApiUrl) {
    throw new Error("dbApiUrl required for syncing to database");
  }

  const envKeys = await parseEnvFile(envPath);
  const serviceEnvVars: Record<ServiceType, string> = {
    ai_gateway: "AI_GATEWAY_API_KEY",
    openai: "OPENAI_API_KEY",
    v0: "V0_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    firecrawl: "FIRECRAWL_API_KEY",
    exa: "EXA_API_KEY",
  };

  // Upload each key to database
  for (const [serviceType, envVar] of Object.entries(serviceEnvVars)) {
    const key = envKeys[envVar];
    if (!key) continue;

    try {
      const response = await fetch(config.dbApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          key,
          environment: "local",
        }),
      });

      if (response.ok) {
        synced.push(serviceType as ServiceType);
      } else {
        const error = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        errors.push(`${serviceType}: ${error.error || response.statusText}`);
      }
    } catch (error) {
      errors.push(
        `${serviceType}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return { synced, errors };
}

/**
 * Validate that local keys match database keys (by hash comparison)
 */
export async function validateKeySync(config: KeySyncConfig): Promise<{
  matches: ServiceType[];
  mismatches: ServiceType[];
  missingLocal: ServiceType[];
  missingDb: ServiceType[];
  errors: string[];
}> {
  const envPath = config.envFilePath || join(process.cwd(), ".env.local");
  const matches: ServiceType[] = [];
  const mismatches: ServiceType[] = [];
  const missingLocal: ServiceType[] = [];
  const missingDb: ServiceType[] = [];
  const errors: string[] = [];

  if (!config.dbApiUrl) {
    throw new Error("dbApiUrl required for validation");
  }

  // Get local keys
  const envKeys = existsSync(envPath) ? await parseEnvFile(envPath) : {};

  // Get DB key hashes (special endpoint that returns hashes only, not keys)
  try {
    const response = await fetch(
      `${config.dbApiUrl}/hashes?userId=${config.userId}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch key hashes: ${response.statusText}`);
    }

    const data = await response.json();
    const dbHashes = new Map<ServiceType, string>();

    for (const item of data.hashes || []) {
      dbHashes.set(item.serviceType as ServiceType, item.hash);
    }

    // Compare
    const serviceEnvVars: Record<ServiceType, string> = {
      ai_gateway: "AI_GATEWAY_API_KEY",
      openai: "OPENAI_API_KEY",
      v0: "V0_API_KEY",
      anthropic: "ANTHROPIC_API_KEY",
      firecrawl: "FIRECRAWL_API_KEY",
      exa: "EXA_API_KEY",
    };

    for (const [serviceType, envVar] of Object.entries(serviceEnvVars)) {
      const localKey = envKeys[envVar];
      const dbHash = dbHashes.get(serviceType as ServiceType);

      if (!localKey && !dbHash) {
        continue; // Both missing, skip
      }

      if (!localKey) {
        missingLocal.push(serviceType as ServiceType);
      } else if (!dbHash) {
        missingDb.push(serviceType as ServiceType);
      } else {
        const localHash = hashKey(localKey);
        if (localHash === dbHash) {
          matches.push(serviceType as ServiceType);
        } else {
          mismatches.push(serviceType as ServiceType);
        }
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown error");
  }

  return { matches, mismatches, missingLocal, missingDb, errors };
}
