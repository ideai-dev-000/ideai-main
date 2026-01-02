#!/usr/bin/env node
/**
 * @fileoverview IdeaI Vercel Project Linker
 * 
 * @module IdeAIVercelLinker
 * @description
 * Links an app to a Vercel project based on .ideai.json configuration.
 * Supports using existing projects or forking to new projects.
 * 
 * Usage:
 *   node scripts/ideai-vercel-link.mjs <app-name>
 * 
 * Example:
 *   node scripts/ideai-vercel-link.mjs web
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

/**
 * Read .ideai.json config for an app
 */
function readIdeAIConfig(appName) {
  const configPath = join(REPO_ROOT, "apps", appName, ".ideai.json");
  if (!existsSync(configPath)) {
    return null;
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

/**
 * Get Vercel project config for an app
 */
function getVercelProjectConfig(appName) {
  const config = readIdeAIConfig(appName);
  
  if (config?.vercelProject) {
    return {
      projectName: config.vercelProject.projectName || appName,
      projectId: config.vercelProject.projectId,
      orgId: config.vercelProject.orgId || "team_vhjzlMi6CfNow0IfBXnv2Yn2",
      forkToNew: config.vercelProject.forkToNew || false,
      newProjectName: config.vercelProject.newProjectName,
    };
  }
  
  // Default: use app name as project name
  return {
    projectName: appName,
    orgId: "team_vhjzlMi6CfNow0IfBXnv2Yn2",
    forkToNew: false,
  };
}

/**
 * Check if Vercel project exists
 */
function projectExists(projectName, orgId) {
  try {
    const output = execSync(
      `vercel projects ls --scope ${orgId} --json`,
      { encoding: "utf-8", cwd: REPO_ROOT }
    );
    const projects = JSON.parse(output);
    return projects.projects?.some((p) => p.name === projectName);
  } catch (error) {
    console.error(`Error checking project existence: ${error.message}`);
    return false;
  }
}

/**
 * Link app to Vercel project
 */
function linkProject(appName, projectConfig) {
  const appDir = join(REPO_ROOT, "apps", appName);
  const vercelDir = join(appDir, ".vercel");
  
  console.log(`\n🔗 Linking ${appName} to Vercel project: ${projectConfig.projectName}`);
  
  // Check if project exists
  const exists = projectExists(projectConfig.projectName, projectConfig.orgId);
  
  if (!exists && !projectConfig.forkToNew) {
    console.error(`❌ Project "${projectConfig.projectName}" does not exist.`);
    console.error(`   Set "vercelProject.forkToNew": true to create a new project.`);
    process.exit(1);
  }
  
  // Link to project
  try {
    const linkCmd = [
      "vercel",
      "link",
      "--yes",
      "--project", projectConfig.projectName,
      "--scope", projectConfig.orgId,
    ];
    
    if (projectConfig.projectId) {
      linkCmd.push("--project-id", projectConfig.projectId);
    }
    
    execSync(linkCmd.join(" "), {
      cwd: appDir,
      stdio: "inherit",
    });
    
    console.log(`✅ Linked ${appName} to ${projectConfig.projectName}`);
  } catch (error) {
    console.error(`❌ Failed to link project: ${error.message}`);
    process.exit(1);
  }
}

// Main
const appName = process.argv[2];

if (!appName) {
  console.error("Usage: node scripts/ideai-vercel-link.mjs <app-name>");
  process.exit(1);
}

const projectConfig = getVercelProjectConfig(appName);
linkProject(appName, projectConfig);
