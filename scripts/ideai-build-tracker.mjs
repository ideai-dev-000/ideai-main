#!/usr/bin/env node
/**
 * @fileoverview IdeaI Build Tracker
 * @description Tracks builds and dependencies for better build management
 * @usage node scripts/ideai-build-tracker.mjs [parent-app] [build|check|report]
 * @location scripts/ideai-build-tracker.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const buildDir = join(rootDir, ".ideai", "builds");

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, data) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
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

function readPackageDeps(appName) {
  const packagePath = join(rootDir, "apps", appName, "package.json");
  const pkg = readJson(packagePath);
  return {
    dependencies: pkg?.dependencies || {},
    devDependencies: pkg?.devDependencies || {},
  };
}

function trackBuild(parentApp) {
  const parentConfig = readIdeAIConfig(parentApp);
  const parentDeps = readPackageDeps(parentApp);
  const childApps = parentConfig?.childApps || [];
  
  const buildData = {
    timestamp: new Date().toISOString(),
    parentApp,
    childApps,
    parentDependencies: {
      ...parentDeps.dependencies,
      ...parentDeps.devDependencies,
    },
    childDependencies: {},
    totalDependencies: Object.keys(parentDeps.dependencies).length + Object.keys(parentDeps.devDependencies).length,
  };
  
  // Collect child dependencies
  childApps.forEach((childApp) => {
    const childDeps = readPackageDeps(childApp);
    buildData.childDependencies[childApp] = {
      ...childDeps.dependencies,
      ...childDeps.devDependencies,
    };
  });
  
  // Save build metadata
  const buildFile = join(buildDir, `${parentApp}-${Date.now()}.json`);
  writeJson(buildFile, buildData);
  
  // Save latest build
  const latestFile = join(buildDir, `${parentApp}-latest.json`);
  writeJson(latestFile, buildData);
  
  console.log(`📊 Build tracked: ${buildFile}`);
  console.log(`   Parent: ${parentApp}`);
  console.log(`   Children: ${childApps.length}`);
  console.log(`   Dependencies: ${buildData.totalDependencies}`);
  
  return buildData;
}

function generateReport(parentApp) {
  const latestFile = join(buildDir, `${parentApp}-latest.json`);
  const buildData = readJson(latestFile);
  
  if (!buildData) {
    console.log(`❌ No build data found for ${parentApp}`);
    console.log(`   Run: node scripts/ideai-build-tracker.mjs ${parentApp} build`);
    return;
  }
  
  console.log(`📊 Build Report: ${parentApp}\n`);
  console.log(`   Last Build: ${new Date(buildData.timestamp).toLocaleString()}`);
  console.log(`   Parent Dependencies: ${Object.keys(buildData.parentDependencies).length}`);
  console.log(`   Child Apps: ${buildData.childApps.length}`);
  
  console.log(`\n📦 Child App Dependencies:`);
  Object.entries(buildData.childDependencies).forEach(([child, deps]) => {
    console.log(`   ${child}: ${Object.keys(deps).length} packages`);
  });
}

function main() {
  const parentApp = process.argv[2] || "web";
  const command = process.argv[3] || "build";
  
  if (command === "build") {
    trackBuild(parentApp);
  } else if (command === "report") {
    generateReport(parentApp);
  } else if (command === "check") {
    // Run dependency check
    execSync(`node scripts/ideai-build-checker-dependency.mjs ${parentApp}`, { stdio: "inherit" });
  } else {
    console.log(`Usage: node scripts/ideai-build-tracker.mjs [parent-app] [build|check|report]`);
    process.exit(1);
  }
}

main();

