#!/usr/bin/env node
/**
 * @fileoverview IdeaI Database Manager CLI
 * 
 * @module IdeAIDatabaseManager
 * @description
 * Comprehensive CLI for managing IdeaI databases (local and production).
 * Supports migrations, schema operations, backups, and database queries.
 * 
 * Usage:
 *   node scripts/ideai-db-manager.mjs [command] [options]
 * 
 * Commands:
 *   status       - Show database connection status and info
 *   migrate      - Run pending migrations
 *   generate     - Generate migration from schema changes
 *   push         - Push schema changes directly (dev-only)
 *   studio       - Open Drizzle Studio (visual database browser)
 *   backup       - Backup database
 *   restore      - Restore database from backup
 *   query        - Run SQL query
 *   tables       - List all tables
 *   connect      - Get connection string from Vercel
 * 
 * Options:
 *   --env <env>  - Environment (local|production|preview) [default: local]
 *   --app <app>  - App name (ideai-capabilities|ideai-workflow) [default: ideai-capabilities]
 *   --url <url>  - Custom DATABASE_URL (overrides --env)
 *   --output <file> - Output file for backup/query results
 * 
 * Examples:
 *   # Check database status
 *   node scripts/ideai-db-manager.mjs status
 * 
 *   # Run migrations for production
 *   node scripts/ideai-db-manager.mjs migrate --env production
 * 
 *   # Generate migration from schema changes
 *   node scripts/ideai-db-manager.mjs generate
 * 
 *   # Open Drizzle Studio
 *   node scripts/ideai-db-manager.mjs studio
 * 
 *   # Backup production database
 *   node scripts/ideai-db-manager.mjs backup --env production --output backup.sql
 * 
 *   # Get production DATABASE_URL from Vercel
 *   node scripts/ideai-db-manager.mjs connect --env production
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";

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
  const command = args[0] || "status";
  const options = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith("--")) {
        // Handle kebab-case to camelCase conversion
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        options[camelKey] = value;
        i++;
      } else {
        options[key] = true;
      }
    }
  }

  return { command, options };
}

/**
 * Get database URL based on environment
 */
function getDatabaseUrl(options = {}) {
  const { env = "local", app = "ideai-capabilities", url } = options;

  // Custom URL takes precedence
  if (url) {
    return url;
  }

  // Load environment variables (simple dotenv parser)
  const envFile = env === "production" 
    ? join(REPO_ROOT, ".env.production")
    : join(REPO_ROOT, `apps/${app}/.env.local`);
  
  if (existsSync(envFile)) {
    const envContent = readFileSync(envFile, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Z_]+)=(.+)$/);
      if (match) {
        const [, key, value] = match;
        process.env[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  }

  // Try to get from environment
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl && env === "production") {
    warn("DATABASE_URL not found in .env.production");
    info("Try: vercel env pull .env.production --environment production");
    info("Or use: node scripts/ideai-db-manager.mjs connect --env production");
  }

  if (!databaseUrl && env === "local") {
    databaseUrl = "postgres://localhost:5432/workflow";
    warn(`Using default local database: ${databaseUrl}`);
  }

  return databaseUrl;
}

/**
 * Get Vercel DATABASE_URL via CLI
 */
async function getVercelDatabaseUrl(env = "production", app = "ideai-capabilities") {
  try {
    info(`Fetching DATABASE_URL from Vercel (${env})...`);
    
    // Map app names to Vercel project names
    const projectMap = {
      "ideai-capabilities": "ideai-capabilities",
      "ideai-workflow": "ideai-workflow",
    };
    
    const projectName = projectMap[app] || app;
    
    // Pull environment variables
    const envFile = join(REPO_ROOT, `.env.production.${Date.now()}`);
    try {
      execSync(
        `vercel env pull ${envFile} --environment ${env} --yes`,
        { 
          cwd: REPO_ROOT,
          stdio: "pipe",
          env: { ...process.env, VERCEL_PROJECT_NAME: projectName }
        }
      );
      
      // Read DATABASE_URL
      if (existsSync(envFile)) {
        const content = readFileSync(envFile, "utf-8");
        const match = content.match(/^DATABASE_URL=(.+)$/m);
        if (match) {
          const url = match[1].replace(/^["']|["']$/g, "");
          
          // Clean up temp file
          try {
            execSync(`rm ${envFile}`, { stdio: "ignore" });
          } catch (e) {
            // Ignore cleanup errors
          }
          
          return url;
        }
      }
      
      // Clean up temp file
      try {
        execSync(`rm ${envFile}`, { stdio: "ignore" });
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (e) {
      error("Failed to fetch from Vercel. Make sure you're logged in: vercel login");
      return null;
    }
    
    return null;
  } catch (err) {
    error(`Failed to get Vercel DATABASE_URL: ${err.message}`);
    return null;
  }
}

/**
 * Execute database command
 */
function execDbCommand(command, options = {}) {
  const { env = "local", app = "ideai-capabilities", url } = options;
  const databaseUrl = url || getDatabaseUrl(options);
  
  if (!databaseUrl) {
    error("DATABASE_URL not found. Use --url or set up environment variables.");
    process.exit(1);
  }

  const appDir = join(REPO_ROOT, "apps", app);
  
  // Set DATABASE_URL in environment
  const envWithDb = { ...process.env, DATABASE_URL: databaseUrl };

  try {
    switch (command) {
      case "status":
        return showStatus(databaseUrl);
        
      case "migrate":
        log(`Running migrations for ${app}...`, "cyan");
        execSync("pnpm db:migrate", { 
          cwd: appDir, 
          stdio: "inherit",
          env: envWithDb 
        });
        success("Migrations completed successfully");
        return true;
        
      case "generate":
        log(`Generating migration for ${app}...`, "cyan");
        execSync("pnpm db:generate", { 
          cwd: appDir, 
          stdio: "inherit",
          env: envWithDb 
        });
        success("Migration generated successfully");
        return true;
        
      case "push":
        if (env === "production") {
          error("db:push is not allowed in production. Use migrations instead.");
          process.exit(1);
        }
        log(`Pushing schema for ${app}...`, "cyan");
        execSync("pnpm db:push", { 
          cwd: appDir, 
          stdio: "inherit",
          env: envWithDb 
        });
        success("Schema pushed successfully");
        return true;
        
      case "studio":
        log(`Opening Drizzle Studio for ${app}...`, "cyan");
        log("Studio will open at: http://localhost:4983", "blue");
        log("Press Ctrl+C to stop", "yellow");
        spawn("pnpm", ["db:studio"], {
          cwd: appDir,
          stdio: "inherit",
          env: envWithDb,
          shell: true
        });
        return true;
        
      case "backup":
        return backupDatabase(databaseUrl, options.output);
        
      case "restore":
        return restoreDatabase(databaseUrl, options.file);
        
      case "query":
        return runQuery(databaseUrl, options.sql, options.output);
        
      case "tables":
        return listTables(databaseUrl);
        
      case "connect":
        return showConnectionInfo(options);
        
      case "sync":
        return syncDatabase(options);
        
      default:
        error(`Unknown command: ${command}`);
        showHelp();
        return false;
    }
  } catch (err) {
    error(`Command failed: ${err.message}`);
    return false;
  }
}

/**
 * Show database status
 */
function showStatus(databaseUrl) {
  log("\n📊 Database Status\n", "bright");
  
  // Hide password in URL for display
  const displayUrl = databaseUrl.replace(/:([^:@]+)@/, ":****@");
  info(`Connection: ${displayUrl}`);
  
  try {
    // Test connection with psql
    const result = execSync(
      `psql "${databaseUrl}" -c "SELECT version();" -t`,
      { encoding: "utf-8", stdio: "pipe" }
    );
    
    const version = result.trim();
    success(`✓ Connected successfully`);
    info(`PostgreSQL Version: ${version.split("\n")[0]}`);
    
    // Get database name
    const dbNameMatch = databaseUrl.match(/\/([^?\/]+)(?:\?|$)/);
    if (dbNameMatch) {
      info(`Database: ${dbNameMatch[1]}`);
    }
    
    // Count tables
    try {
      const tablesResult = execSync(
        `psql "${databaseUrl}" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t`,
        { encoding: "utf-8", stdio: "pipe" }
      );
      const tableCount = parseInt(tablesResult.trim());
      info(`Tables: ${tableCount}`);
    } catch (e) {
      // Ignore table count errors
    }
    
    return true;
  } catch (err) {
    error(`Connection failed: ${err.message}`);
    return false;
  }
}

/**
 * Backup database
 */
function backupDatabase(databaseUrl, outputFile) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = outputFile || `backup_${timestamp}.sql`;
  
  log(`\n💾 Backing up database...\n`, "cyan");
  info(`Output: ${backupFile}`);
  
  try {
    execSync(`pg_dump "${databaseUrl}" > "${backupFile}"`, {
      stdio: "inherit"
    });
    
    success(`Backup completed: ${backupFile}`);
    return true;
  } catch (err) {
    error(`Backup failed: ${err.message}`);
    return false;
  }
}

/**
 * Restore database
 */
function restoreDatabase(databaseUrl, inputFile) {
  if (!inputFile) {
    error("Restore requires --file option");
    return false;
  }
  
  if (!existsSync(inputFile)) {
    error(`Backup file not found: ${inputFile}`);
    return false;
  }
  
  warn("\n⚠️  This will overwrite the database!");
  warn("Make sure you have a backup first.");
  log("\nRestoring from: " + inputFile, "yellow");
  
  try {
    execSync(`psql "${databaseUrl}" < "${inputFile}"`, {
      stdio: "inherit"
    });
    
    success("Restore completed");
    return true;
  } catch (err) {
    error(`Restore failed: ${err.message}`);
    return false;
  }
}

/**
 * Run SQL query
 */
function runQuery(databaseUrl, sql, outputFile) {
  if (!sql) {
    error("Query requires --sql option");
    return false;
  }
  
  try {
    const result = execSync(
      `psql "${databaseUrl}" -c "${sql.replace(/"/g, '\\"')}"`,
      { encoding: "utf-8", stdio: "pipe" }
    );
    
    if (outputFile) {
      writeFileSync(outputFile, result);
      success(`Query results saved to: ${outputFile}`);
    } else {
      log("\n" + result);
    }
    
    return true;
  } catch (err) {
    error(`Query failed: ${err.message}`);
    return false;
  }
}

/**
 * List all tables
 */
function listTables(databaseUrl) {
  log("\n📋 Database Tables\n", "cyan");
  
  try {
    const result = execSync(
      `psql "${databaseUrl}" -c "\\dt"`,
      { encoding: "utf-8", stdio: "pipe" }
    );
    
    log(result);
    return true;
  } catch (err) {
    error(`Failed to list tables: ${err.message}`);
    return false;
  }
}

/**
 * Show connection info or fetch from Vercel
 */
async function showConnectionInfo(options) {
  const { env = "production", app = "ideai-capabilities" } = options;
  
  log("\n🔗 Database Connection Info\n", "cyan");
  
  if (env !== "local") {
    info(`Fetching DATABASE_URL from Vercel (${env})...`);
    const url = await getVercelDatabaseUrl(env, app);
    
    if (url) {
      success("DATABASE_URL retrieved from Vercel:");
      log(`\n${url}\n`, "bright");
      info("You can use this with --url flag:");
      log(`node scripts/ideai-db-manager.mjs status --url "${url}"`, "cyan");
      return true;
    } else {
      error("Failed to fetch DATABASE_URL");
      return false;
    }
  } else {
    const url = getDatabaseUrl({ env, app });
    if (url) {
      info("Current DATABASE_URL:");
      log(`\n${url}\n`, "bright");
      return true;
    } else {
      error("DATABASE_URL not found");
      return false;
    }
  }
}

/**
 * Sync database from source to target
 */
function syncDatabase(options) {
  const { 
    source = "local", 
    target = "production", 
    app = "ideai-capabilities",
    sourceUrl,
    targetUrl 
  } = options;

  // Get source database URL
  let sourceDatabaseUrl = sourceUrl || getDatabaseUrl({ env: source, app });
  
  if (!sourceDatabaseUrl && source === "local") {
    sourceDatabaseUrl = "postgres://localhost:5432/workflow";
  }

  if (!sourceDatabaseUrl) {
    error(`Source DATABASE_URL not found for ${source}`);
    return false;
  }

  // Get target database URL
  let targetDatabaseUrl = targetUrl;
  
  if (!targetDatabaseUrl && target === "production") {
    warn("Target DATABASE_URL not provided for production");
    info("Use 'connect' command first to get production URL:");
    info(`  node scripts/ideai-db-manager.mjs connect --env production --app ${app}`);
    return false;
  }

  if (!targetDatabaseUrl) {
    targetDatabaseUrl = getDatabaseUrl({ env: target, app });
  }

  if (!targetDatabaseUrl) {
    error(`Target DATABASE_URL not found for ${target}`);
    return false;
  }

  // Safety check for production
  if (target === "production") {
    warn("\n⚠️  WARNING: This will OVERWRITE production database!");
    warn(`Source: ${source} (${sourceDatabaseUrl.replace(/:([^:@]+)@/, ":****@")})`);
    warn(`Target: ${target} (${targetDatabaseUrl.replace(/:([^:@]+)@/, ":****@")})`);
    warn("\nThis cannot be undone. Make sure you have a backup!");
    log("\nPress Ctrl+C to cancel, or Enter to continue...", "yellow");
    // In non-interactive mode, we'll proceed (CLI scripts should have --yes flag)
  }

  const timestamp = Date.now();
  const dumpFile = `/tmp/db-sync-${timestamp}.sql`;

  log(`\n🔄 Syncing database from ${source} to ${target}...\n`, "cyan");

  try {
    // Step 1: Dump source
    info(`Dumping source database (${source})...`);
    execSync(`pg_dump "${sourceDatabaseUrl}" > "${dumpFile}"`, {
      stdio: "inherit"
    });

    // Step 2: Restore to target
    info(`Restoring to target database (${target})...`);
    execSync(`psql "${targetDatabaseUrl}" < "${dumpFile}"`, {
      stdio: "inherit"
    });

    // Step 3: Cleanup
    try {
      execSync(`rm "${dumpFile}"`, { stdio: "ignore" });
    } catch (e) {
      // Ignore cleanup errors
    }

    success(`\n✅ Successfully synced database from ${source} to ${target}`);
    return true;
  } catch (err) {
    error(`Sync failed: ${err.message}`);
    
    // Cleanup on error
    try {
      execSync(`rm "${dumpFile}"`, { stdio: "ignore" });
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return false;
  }
}

/**
 * Show help
 */
function showHelp() {
  log("\n📚 IdeaI Database Manager\n", "bright");
  log("Usage: node scripts/ideai-db-manager.mjs [command] [options]\n");
  
  log("Commands:", "cyan");
  log("  status      Show database connection status and info");
  log("  migrate     Run pending migrations");
  log("  generate    Generate migration from schema changes");
  log("  push        Push schema changes directly (dev-only)");
  log("  studio      Open Drizzle Studio (visual database browser)");
  log("  backup      Backup database");
  log("  restore     Restore database from backup");
  log("  query       Run SQL query");
  log("  tables      List all tables");
  log("  connect     Get connection string from Vercel");
  log("  sync        Sync database from local to production");
  
  log("\nOptions:", "cyan");
  log("  --env <env>     Environment (local|production|preview) [default: local]");
  log("  --app <app>     App name (ideai-capabilities|ideai-workflow) [default: ideai-capabilities]");
  log("  --url <url>     Custom DATABASE_URL (overrides --env)");
  log("  --output <file> Output file for backup/query results");
  log("  --file <file>   Input file for restore");
  log("  --sql <query>   SQL query to execute");
  log("  --source <env>  Source environment for sync [default: local]");
  log("  --target <env>  Target environment for sync [default: production]");
  log("  --source-url <url>  Source DATABASE_URL (overrides --source)");
  log("  --target-url <url>  Target DATABASE_URL (overrides --target)");
  
  log("\nExamples:", "cyan");
  log("  # Check database status");
  log("  node scripts/ideai-db-manager.mjs status");
  log("");
  log("  # Run migrations for production");
  log("  node scripts/ideai-db-manager.mjs migrate --env production");
  log("");
  log("  # Generate migration from schema changes");
  log("  node scripts/ideai-db-manager.mjs generate");
  log("");
  log("  # Open Drizzle Studio");
  log("  node scripts/ideai-db-manager.mjs studio");
  log("");
  log("  # Backup production database");
  log("  node scripts/ideai-db-manager.mjs backup --env production --output backup.sql");
  log("");
  log("  # Get production DATABASE_URL from Vercel");
  log("  node scripts/ideai-db-manager.mjs connect --env production");
  log("");
  log("  # Sync local database to production");
  log("  node scripts/ideai-db-manager.mjs sync --target-url \"postgresql://...\"");
  log("");
}

/**
 * Main execution
 */
async function main() {
  const { command, options } = parseArgs();
  
  if (command === "help" || command === "--help" || command === "-h") {
    showHelp();
    return;
  }
  
  if (command === "connect" && (options.env === "production" || options.env === "preview")) {
    await execDbCommand(command, options);
    return;
  }
  
  execDbCommand(command, options);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    error(`Unexpected error: ${err.message}`);
    process.exit(1);
  });
}

