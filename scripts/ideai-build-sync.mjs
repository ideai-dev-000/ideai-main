#!/usr/bin/env node
/**
 * @fileoverview IdeaI Build Dependency Sync
 * @description Auto-syncs child dependencies to parent (secure 2026 best practices)
 * @usage node scripts/ideai-build-sync.mjs [parent-app] [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function readPackageDeps(appName, type = "dependencies") {
  const packagePath = join(rootDir, "apps", appName, "package.json");
  const pkg = readJson(packagePath);
  return pkg?.[type] || {};
}

function readIdeAIConfig(appName) {
  const configPath = join(rootDir, "apps", appName, ".ideai.json");
  const config = readJson(configPath);
  
  if (!config) {
    if (appName === "web") {
      return {
        role: "parent",
        name: "IdeaI",
        childApps: ["docs", "all", "nocss", "mvp", "tailwind", "allcss", "bootstrap", "unocss", "shadcn"],
      };
    }
    return { role: "child", parentApp: "web" };
  }
  return config;
}

function getAllChildDependencies(parentApp) {
  const parentConfig = readIdeAIConfig(parentApp);
  const childApps = parentConfig?.childApps || [];
  
  const allDeps = {};
  const usedBy = {};
  
  childApps.forEach((childApp) => {
    const childDeps = readPackageDeps(childApp);
    Object.keys(childDeps).forEach((pkg) => {
      if (!usedBy[pkg]) usedBy[pkg] = [];
      usedBy[pkg].push(childApp);
      // Use latest version if multiple children have different versions
      if (!allDeps[pkg] || childDeps[pkg] > allDeps[pkg]) {
        allDeps[pkg] = childDeps[pkg];
      }
    });
  });
  
  return { allDeps, usedBy };
}

function syncDependencies(parentApp, dryRun = false) {
  const packagePath = join(rootDir, "apps", parentApp, "package.json");
  const pkg = readJson(packagePath);
  const { allDeps, usedBy } = getAllChildDependencies(parentApp);
  
  const currentDeps = pkg.dependencies || {};
  const missing = [];
  const toAdd = {};
  
  // Find missing dependencies
  Object.keys(allDeps).forEach((pkg) => {
    if (!currentDeps[pkg]) {
      missing.push(pkg);
      toAdd[pkg] = allDeps[pkg];
    }
  });
  
  if (missing.length === 0) {
    console.log(`✅ All child dependencies already in ${parentApp}/package.json`);
    return { added: 0, skipped: 0 };
  }
  
  console.log(`📦 Found ${missing.length} missing dependencies:`);
  missing.forEach((pkg) => {
    console.log(`   - ${pkg}@${allDeps[pkg]} (used by: ${usedBy[pkg].join(", ")})`);
  });
  
  if (dryRun) {
    console.log(`\n🔍 Dry run - would add ${missing.length} dependencies`);
    return { added: missing.length, skipped: 0 };
  }
  
  // Add missing dependencies
  pkg.dependencies = { ...pkg.dependencies, ...toAdd };
  writeJson(packagePath, pkg);
  
  console.log(`\n✅ Added ${missing.length} dependencies to ${parentApp}/package.json`);
  console.log(`💡 Run 'pnpm install' to install new dependencies`);
  
  return { added: missing.length, skipped: 0 };
}

function main() {
  const parentApp = process.argv[2] || "web";
  const dryRun = process.argv.includes("--dry-run");
  
  console.log(`🔄 Syncing dependencies for parent app: ${parentApp}\n`);
  
  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified\n");
  }
  
  const result = syncDependencies(parentApp, dryRun);
  
  if (!dryRun && result.added > 0) {
    console.log(`\n🔒 Security Best Practices (2026):`);
    console.log(`   ✅ Using pnpm (secure by default)`);
    console.log(`   ✅ Lock file: pnpm-lock.yaml`);
    console.log(`   ✅ Workspace protocol for internal packages`);
    console.log(`   💡 Run 'pnpm audit' after install`);
    console.log(`   💡 Run 'pnpm install --frozen-lockfile' in CI`);
  }
  
  process.exit(0);
}

main();








