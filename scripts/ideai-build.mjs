#!/usr/bin/env node
/**
 * @fileoverview IdeaI Build - Complete Deployment and Setup System
 * 
 * @module IdeAIBuild
 * @description
 * Comprehensive CLI for IdeaI project setup, deployment, and management.
 * Supports one-click setup of new projects (repo + Vercel + domain).
 * 
 * Also accessible via: node scripts/ideai-ui-main.mjs (Unified UI)
 * 
 * Usage:
 *   node scripts/ideai-build.mjs setup [options]
 *   node scripts/ideai-build.mjs verify [options]
 *   node scripts/ideai-build.mjs update [options]
 *   node scripts/ideai-build.mjs rules [options]
 * 
 * Examples:
 *   # Interactive setup
 *   node scripts/ideai-build.mjs setup
 * 
 *   # Config file setup
 *   node scripts/ideai-build.mjs setup --config setup.json
 * 
 *   # Quick setup (defaults)
 *   node scripts/ideai-build.mjs setup --quick
 * 
 *   # Verify existing setup
 *   node scripts/ideai-build.mjs verify
 * 
 *   # Or use the unified UI
 *   node scripts/ideai-ui-main.mjs
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import readline from "readline";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

// Colors for output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function warn(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith("--")) {
        options[key] = value;
        i++;
      } else {
        options[key] = true;
      }
    }
  }

  return { command, options };
}

/**
 * Read configuration file
 */
function readConfig(configPath) {
  if (!existsSync(configPath)) {
    error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to parse config file: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Create readline interface for prompts
 */
function createRLI() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompt for user input
 */
function prompt(question) {
  return new Promise((resolve) => {
    const rli = createRLI();
    rli.question(question, (answer) => {
      rli.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt for yes/no
 */
async function promptYesNo(question, defaultValue = false) {
  const defaultText = defaultValue ? "Y/n" : "y/N";
  const answer = await prompt(`${question} [${defaultText}]: `);
  if (!answer) return defaultValue;
  return answer.toLowerCase().startsWith("y");
}

/**
 * Interactive setup wizard
 */
async function interactiveSetup() {
  log("\n🚀 IdeaI Build - Interactive Setup Wizard", "bright");
  log("=" .repeat(50), "cyan");

  const config = {
    project: {},
    github: {},
    vercel: {},
    dns: {},
  };

  // Project configuration
  log("\n📦 Project Configuration", "bright");
  config.project.name = await prompt("Project name: ");
  config.project.description = await prompt("Description (optional): ") || "";
  
  const appsInput = await prompt("Apps to create (comma-separated, e.g., web,docs): ");
  config.project.apps = appsInput.split(",").map(a => a.trim()).filter(Boolean);
  
  if (config.project.apps.length === 0) {
    config.project.apps = ["web"];
    warn("No apps specified, defaulting to 'web'");
  }

  // GitHub configuration
  log("\n🐙 GitHub Configuration", "bright");
  const useGitHub = await promptYesNo("Setup GitHub repository?", true);
  if (useGitHub) {
    config.github.enabled = true;
    config.github.org = await prompt("GitHub organization (or username): ");
    config.github.repo = await prompt("Repository name: ", config.project.name);
    config.github.private = await promptYesNo("Private repository?", false);
  } else {
    config.github.enabled = false;
  }

  // Vercel configuration
  log("\n▲ Vercel Configuration", "bright");
  const useVercel = await promptYesNo("Setup Vercel projects?", true);
  if (useVercel) {
    config.vercel.enabled = true;
    config.vercel.orgId = await prompt("Vercel organization ID: ");
    
    config.vercel.projects = [];
    for (const app of config.project.apps) {
      const projectName = await prompt(`Vercel project name for '${app}': `, app);
      const domain = await prompt(`Domain for '${app}' (optional, press Enter to skip): `);
      
      config.vercel.projects.push({
        app,
        projectName: projectName || app,
        domain: domain || undefined,
      });
    }
  } else {
    config.vercel.enabled = false;
  }

  // DNS configuration
  log("\n🌐 DNS Configuration", "bright");
  const useDNS = await promptYesNo("Setup DNS and domains?", false);
  if (useDNS) {
    config.dns.enabled = true;
    config.dns.provider = await prompt("DNS provider (cloudflare/route53/manual): ", "manual");
    config.dns.rootDomain = await prompt("Root domain: ");
    
    config.dns.subdomains = [];
    for (const app of config.project.apps.slice(1)) {
      const useSubdomain = await promptYesNo(`Setup subdomain for '${app}'?`, false);
      if (useSubdomain) {
        const subdomain = await prompt(`Subdomain for '${app}': `, app);
        config.dns.subdomains.push({ app, subdomain: subdomain || app });
      }
    }
  } else {
    config.dns.enabled = false;
  }

  // Summary
  log("\n📋 Setup Summary", "bright");
  log(JSON.stringify(config, null, 2), "cyan");
  
  const confirm = await promptYesNo("\nProceed with setup?", true);
  if (!confirm) {
    log("Setup cancelled.", "yellow");
    process.exit(0);
  }

  return config;
}

/**
 * Quick setup with defaults
 */
function quickSetup(options) {
  const name = options.name || "ideai-project";
  
  return {
    project: {
      name,
      description: `IdeaI project: ${name}`,
      apps: ["web"],
    },
    github: {
      enabled: true,
      repo: name,
      private: false,
    },
    vercel: {
      enabled: true,
      orgId: options.orgId || "team_vhjzlMi6CfNow0IfBXnv2Yn2",
      projects: [
        {
          app: "web",
          projectName: name,
        },
      ],
    },
    dns: {
      enabled: false,
    },
  };
}

/**
 * Generate project structure
 */
async function generateProject(config) {
  log("\n📁 Generating project structure...", "bright");
  
  const projectDir = join(process.cwd(), config.project.name);
  
  if (existsSync(projectDir)) {
    error(`Directory already exists: ${projectDir}`);
    process.exit(1);
  }

  try {
    mkdirSync(projectDir, { recursive: true });
    success(`Created directory: ${projectDir}`);
    
    // Create apps directory
    const appsDir = join(projectDir, "apps");
    mkdirSync(appsDir, { recursive: true });
    
    // Create packages directory
    const packagesDir = join(projectDir, "packages");
    mkdirSync(packagesDir, { recursive: true });
    
    // Create .gitignore
    const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
*.log
*.pid
*.seed
*.pid.lock

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Turborepo
.turbo
`;
    writeFileSync(join(projectDir, ".gitignore"), gitignore);
    success("Created .gitignore");
    
    // Create root package.json
    const rootPackageJson = {
      name: config.project.name,
      version: "0.1.0",
      private: true,
      packageManager: "pnpm@9.0.0",
      scripts: {
        dev: "turbo run dev",
        build: "turbo run build",
        lint: "turbo run lint",
        "check-types": "turbo run check-types",
      },
      devDependencies: {
        turbo: "^2.0.0",
      },
    };
    writeFileSync(
      join(projectDir, "package.json"),
      JSON.stringify(rootPackageJson, null, 2) + "\n"
    );
    success("Created root package.json");
    
    // TODO: Initialize apps, packages, etc.
    // This is a foundation - full implementation in next phase
    
    info("Project structure generated (basic)");
    warn("Full app initialization coming in next phase");
    
    return projectDir;
  } catch (err) {
    error(`Failed to generate project: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Main setup function
 */
async function setup(options) {
  let config;

  if (options.config) {
    // Load from config file
    config = readConfig(options.config);
  } else if (options.quick) {
    // Quick setup with defaults
    config = quickSetup(options);
  } else {
    // Interactive setup
    config = await interactiveSetup();
  }

  // Generate project
  const projectDir = await generateProject(config);

  // TODO: Implement GitHub, Vercel, DNS setup
  // This is Phase 1 - foundation only
  
  log("\n🎉 Setup complete!", "green");
  log(`\nProject created at: ${projectDir}`, "cyan");
  warn("Note: Full automation coming in next phases");
  log("\nNext steps:", "bright");
  log("  1. cd " + config.project.name);
  log("  2. pnpm install");
  log("  3. Configure GitHub, Vercel, DNS manually");
  log("  4. Or wait for full automation in next phase");
}

/**
 * Verify existing setup
 */
async function verify(options) {
  log("\n🔍 Verifying IdeaI project setup...", "bright");
  
  // Sync submodules before verification
  log("\n📦 Syncing submodules...", "blue");
  try {
    const { syncSubmodules } = await import("./ideai-build-sync-submodules.mjs");
    const exitCode = syncSubmodules();
    if (exitCode !== 0) {
      warn("Some submodules failed to sync, continuing anyway...");
    }
  } catch (err) {
    warn(`Submodule sync failed: ${err.message}`);
    warn("Continuing with verification anyway...");
  }
  
  // Import verification modules
  const docsVerifierPath = join(__dirname, "ideai-build", "docs-verifier.mjs");
  const buildUIPath = join(__dirname, "ideai-build", "build-ui.mjs");
  
  let verifyDocs, formatVerificationResult, showBuildUI, createDefaultBuildSteps;
  
  try {
    const docsModule = await import(`file://${docsVerifierPath}`);
    verifyDocs = docsModule.verifyDocs;
    formatVerificationResult = docsModule.formatVerificationResult;
  } catch (error) {
    error(`Failed to load docs verifier: ${error.message}`);
    process.exit(1);
  }
  
  try {
    const uiModule = await import(`file://${buildUIPath}`);
    showBuildUI = uiModule.showBuildUI;
    createDefaultBuildSteps = uiModule.createDefaultBuildSteps;
  } catch (error) {
    error(`Failed to load build UI: ${error.message}`);
    process.exit(1);
  }
  
  // Check what to verify
  const verifyDocsOnly = options.docs === true;
  const noUI = options["no-ui"] === true || options.ui === false;
  const showUI = !noUI; // Default to true unless --no-ui or --ui=false
  
  if (verifyDocsOnly) {
    // Documentation verification only
    log("\n📚 Verifying documentation...", "bright");
    const result = await verifyDocs();
    
    console.log("\n" + formatVerificationResult(result));
    
    if (!result.passed) {
      error("Documentation verification failed!");
      process.exit(1);
    } else {
      success("Documentation verification passed!");
    }
  } else if (showUI) {
    // Full build verification with UI
    const steps = createDefaultBuildSteps();
    
    // Add custom steps if needed
    if (options.steps) {
      // Custom steps can be added here
    }
    
    const allPassed = await showBuildUI(steps, { 
      interactive: true, 
      verbose: options.verbose || false,
      monitorMemory: true, // Enable memory monitoring in UI
    });
    
    if (!allPassed) {
      error("Build verification failed!");
      process.exit(1);
    }
  } else {
    // Silent verification (no UI)
    log("\nRunning verification checks...", "bright");
    
    const steps = createDefaultBuildSteps();
    let allPassed = true;
    
    for (const step of steps) {
      log(`  Checking: ${step.name}...`, "cyan");
      const passed = await step.execute();
      
      if (passed) {
        success(`  ✅ ${step.name} passed`);
      } else {
        error(`  ❌ ${step.name} failed: ${step.error}`);
        allPassed = false;
        if (step.required && !step.skipOnFailure) {
          break;
        }
      }
    }
    
    if (!allPassed) {
      error("Verification failed!");
      process.exit(1);
    } else {
      success("All verification checks passed!");
    }
  }
}

/**
 * Update configuration
 */
async function update(options) {
  log("\n🔄 Updating IdeaI project configuration...", "bright");
  
  // TODO: Implement update
  warn("Update system coming in Phase 9");
}

/**
 * Rules management
 */
async function rules(options) {
  log("\n📋 IdeaI Rules Management", "bright");
  
  // Import rules manager
  const rulesManagerPath = join(__dirname, "ideai-build", "modules", "rules-manager.mjs");
  let rulesManager;
  
  try {
    rulesManager = await import(`file://${rulesManagerPath}`);
  } catch (error) {
    error(`Failed to load rules manager: ${error.message}`);
    process.exit(1);
  }
  
  const subcommand = options._?.[0] || 'list';
  
  switch (subcommand) {
    case 'propose':
      await proposeRule(rulesManager, options);
      break;
    case 'list':
      await listRules(rulesManager);
      break;
    case 'approve':
      await approveRules(rulesManager, options);
      break;
    case 'sync':
      await syncRules(rulesManager, options);
      break;
    default:
      log("\nUsage:", "cyan");
      log("  node scripts/ideai-build.mjs rules <command>", "cyan");
      log("\nCommands:", "cyan");
      log("  propose <title> <content>  - Propose a new rule");
      log("  list                      - List pending rules");
      log("  approve                   - Interactive rule approval");
      log("  sync                      - Sync approved rules to .cursorrules and .ideai-rules.md");
      process.exit(1);
  }
}

/**
 * Propose a new rule
 */
async function proposeRule(rulesManager, options) {
  const title = options.title || options._?.[1];
  const content = options.content || options._?.[2];
  
  if (!title || !content) {
    error("Title and content required");
    log("Usage: node scripts/ideai-build.mjs rules propose --title 'Rule Title' --content 'Rule content'");
    process.exit(1);
  }
  
  const rule = {
    title,
    content,
    category: options.category || 'general',
    rationale: options.rationale || '',
    examples: options.examples ? options.examples.split(',').map(e => e.trim()) : [],
    priority: options.priority || 'medium',
  };
  
  const result = await rulesManager.proposeRule(rule);
  success(result.message);
  log(`Rule ID: ${result.id}`);
  log(`File: ${result.file}`);
}

/**
 * List pending rules
 */
async function listRules(rulesManager) {
  const pendingRules = rulesManager.listPendingRules();
  
  if (pendingRules.length === 0) {
    success("No pending rules");
    return;
  }
  
  log(`\nFound ${pendingRules.length} pending rule(s):\n`, "bright");
  
  for (const rule of pendingRules) {
    log(`ID: ${rule.id}`, "cyan");
    log(`Title: ${rule.title}`);
    log(`Category: ${rule.category}`);
    log(`Priority: ${rule.priority}`);
    log(`Proposed by: ${rule.proposedBy}`);
    log(`Proposed at: ${rule.proposedAt}`);
    log(`Content: ${rule.content}`);
    if (rule.rationale) {
      log(`Rationale: ${rule.rationale}`);
    }
    log("");
  }
}

/**
 * Approve rules interactively
 */
async function approveRules(rulesManager, options) {
  if (options.id) {
    // Approve specific rule
    const notes = options.notes || '';
    const result = await rulesManager.approveRule(options.id, { notes });
    success(result.message);
  } else {
    // Interactive approval
    await rulesManager.interactiveApprove();
  }
}

/**
 * Sync approved rules
 */
async function syncRules(rulesManager, options) {
  const result = await rulesManager.syncRules({ dryRun: options['dry-run'] || false });
  
  if (result.synced === 0) {
    warn(result.message);
  } else {
    success(result.message);
    log(`Synced ${result.synced} rule(s)`);
    if (options['dry-run']) {
      warn("Dry run - no files were modified");
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  const { command, options } = parseArgs();

  switch (command) {
    case "setup":
      await setup(options);
      break;
    case "verify":
      await verify(options);
      break;
    case "update":
      await update(options);
      break;
    case "rules":
      await rules(options);
      break;
    default:
      log("IdeaI Build - Complete Deployment and Setup System", "bright");
      log("\nUsage:", "cyan");
      log("  node scripts/ideai-build.mjs <command> [options]");
      log("\nCommands:", "cyan");
      log("  setup     - Setup new IdeaI project");
      log("  verify    - Verify existing setup (with memory monitoring)");
      log("  update    - Update project configuration");
      log("  rules     - Manage development rules (propose, approve, sync)");
      log("\nOptions:", "cyan");
      log("  --config <file>  - Use config file");
      log("  --quick          - Quick setup with defaults");
      log("  --name <name>    - Project name (for quick setup)");
      log("  --org-id <id>    - Vercel org ID (for quick setup)");
      log("  --docs           - Verify documentation only");
      log("  --ui             - Show build UI (default: true)");
      log("  --no-ui          - Run verification without UI");
      log("  --verbose        - Show verbose output");
      log("\nExamples:", "cyan");
      log("  node scripts/ideai-build.mjs setup");
      log("  node scripts/ideai-build.mjs verify");
      log("  node scripts/ideai-build.mjs verify --docs");
      log("  node scripts/ideai-build.mjs rules list");
      log("  node scripts/ideai-build.mjs rules approve");
      log("  node scripts/ideai-build.mjs rules sync");
      process.exit(1);
  }
}

// Run main
main().catch((err) => {
  error(`Fatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});

