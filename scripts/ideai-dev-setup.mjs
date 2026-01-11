#!/usr/bin/env node

/**
 * @fileoverview IdeaI Dev Setup CLI
 * 
 * @description
 * CLI tool for validating dev setup. Can run checks and fix issues automatically.
 * Usage:
 *   pnpm dev-setup check    # Run all checks (requires dev server)
 *   pnpm dev-setup migrate  # Run database migration
 */

import { execSync } from "child_process";

const command = process.argv[2];

async function runChecks() {
  // For CLI, we'll make a direct API call to the dev-setup check endpoint
  // This requires the dev server to be running, but provides consistent results
  try {
    const apiUrl = process.env.IDEAI_DEV_SETUP_API_URL || "http://localhost:3018";
    const response = await fetch(`${apiUrl}/api/dev-setup/check`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log("🔍 Running IdeaI dev setup checks...\n");
    
    // Display results
    for (const check of data.checks || []) {
      const icon = 
        check.status === "pass" ? "✅" :
        check.status === "fail" ? "❌" :
        check.status === "warning" ? "⚠️ " :
        "⏭️ ";
      
      console.log(`${icon} ${check.check}: ${check.message}`);
      
      if (check.fixSteps && check.fixSteps.length > 0) {
        console.log("   Fix:");
        for (const step of check.fixSteps) {
          console.log(`      ${step}`);
        }
      }
    }
    
    console.log(`\n${data.canProceed ? "✅" : "❌"} Can proceed: ${data.canProceed}`);
    console.log(`   All passed: ${data.allPassed}`);
    
    return data.canProceed ? 0 : 1;
  } catch (error) {
    console.error("❌ Error running checks:", error instanceof Error ? error.message : error);
    console.log("\n💡 Tip: Make sure dev server is running (pnpm dev)");
    return 1;
  }
}

async function runMigration() {
  console.log("🔧 Running database migration...\n");
  try {
    execSync("cd apps/ideai-capabilities && pnpm db:push", {
      stdio: "inherit",
      encoding: "utf8",
    });
    console.log("\n✅ Migration completed successfully");
    return 0;
  } catch (error) {
    console.error("\n❌ Migration failed:", error instanceof Error ? error.message : error);
    return 1;
  }
}

async function main() {
  try {
    switch (command) {
      case "check":
        process.exit(await runChecks());

      case "migrate":
        process.exit(await runMigration());

      default:
        console.log(`
IdeaI Dev Setup CLI

Usage:
  pnpm dev-setup check      Run all setup checks (requires dev server)
  pnpm dev-setup migrate    Run database migration

Checks:
  - Database migrations
  - Auth configuration
  - Service keys setup
  - Environment variables
  - Key sync CLI setup

Examples:
  pnpm dev-setup check      # Check current setup
  pnpm dev-setup migrate    # Run migrations
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
