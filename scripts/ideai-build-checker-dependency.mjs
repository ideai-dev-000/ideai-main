#!/usr/bin/env node
/**
 * @fileoverview Dependency Checker Module - Verifies parent has all child dependencies
 * 
 * @module DependencyChecker
 * @description
 * Ensures parent apps have all dependencies needed by child apps.
 * Critical for monorepo builds where child apps are embedded.
 * @location scripts/ideai-build-checker-dependency.mjs
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function readPackageDeps(appName, type = "dependencies") {
  const packagePath = join(REPO_ROOT, "apps", appName, "package.json");
  const pkg = readJson(packagePath);
  return pkg?.[type] || {};
}

function readIdeAIConfig(appName) {
  const configPath = join(REPO_ROOT, "apps", appName, ".ideai.json");
  const config = readJson(configPath);
  
  if (!config) {
    if (appName === "web") {
      return {
        role: "parent",
        name: "IdeaI",
        childApps: ["docs", "all", "nocss", "mvp", "tailwind", "allcss", "bootstrap", "unocss", "shadcn"],
      };
    }
    return {
      role: "child",
      parentApp: "web",
    };
  }
  return config;
}

/**
 * Check dependencies for a parent app
 */
export function checkDependencies(parentApp = "web") {
  const parentDeps = readPackageDeps(parentApp);
  const parentDevDeps = readPackageDeps(parentApp, "devDependencies");
  const parentConfig = readIdeAIConfig(parentApp);
  const childApps = parentConfig?.childApps || [];
  
  const childrenDeps = {};
  const allDeps = { ...parentDeps, ...parentDevDeps };
  const missing = [];
  const usedBy = {};
  
  // Collect all child dependencies
  childApps.forEach((childApp) => {
    const childDeps = readPackageDeps(childApp);
    const childDevDeps = readPackageDeps(childApp, "devDependencies");
    childrenDeps[childApp] = { ...childDeps, ...childDevDeps };
    
    Object.keys({ ...childDeps, ...childDevDeps }).forEach((pkg) => {
      if (!usedBy[pkg]) usedBy[pkg] = [];
      usedBy[pkg].push(childApp);
    });
    
    Object.keys(childDeps).forEach((pkg) => {
      if (!allDeps[pkg] && !parentDeps[pkg]) {
        missing.push(pkg);
      }
      if (!allDeps[pkg]) {
        allDeps[pkg] = childDeps[pkg];
      }
    });
  });
  
  return {
    passed: missing.length === 0,
    parentApp,
    parentConfig,
    parentDeps,
    childrenDeps,
    allDeps,
    missing: [...new Set(missing)],
    usedBy,
    summary: {
      totalDependencies: Object.keys(allDeps).length,
      missingCount: missing.length,
      childAppsCount: childApps.length,
    },
  };
}


