#!/usr/bin/env node

/**
 * @fileoverview Modern dev server manager for IdeaI monorepo
 * 
 * @description
 * Automatically discovers all apps, manages their lifecycle, and provides
 * status monitoring. 2027-facing, no bloat, best practices.
 * 
 * SAFETY FEATURES:
 * - Prevents Mac crashes by limiting concurrent app starts
 * - Configurable exclusion list (EXCLUDED_APPS) to skip problematic apps
 * - 3-second delay between app starts to prevent resource spikes
 * - Requires --force flag to start more than 3 apps at once
 * 
 * Usage:
 *   node scripts/dev-manager.mjs status         # Show status of all apps
 *   node scripts/dev-manager.mjs start          # Start safe apps only (web, docs)
 *   node scripts/dev-manager.mjs start web      # Start specific app
 *   node scripts/dev-manager.mjs start --force  # Start ALL apps (dangerous!)
 *   node scripts/dev-manager.mjs stop           # Stop all apps
 *   node scripts/dev-manager.mjs stop docs      # Stop specific app
 *   node scripts/dev-manager.mjs restart        # Restart all apps
 * 
 * Configuration:
 *   Edit EXCLUDED_APPS array (line ~49) to exclude apps from auto-start
 *   Edit MAX_APPS_WITHOUT_CONFIRM (line ~67) to change safety limit
 *   Edit START_DELAY_MS (line ~68) to change delay between starts
 */

import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const APPS_DIR = join(REPO_ROOT, 'apps');

/**
 * SAFETY CONFIGURATION
 * 
 * To prevent Mac crashes from starting too many apps at once:
 * 
 * 1. EXCLUDED_APPS: Apps to skip when starting all apps
 *    - Add app IDs here to exclude them from auto-start
 *    - Example: ['all', 'nocss', 'mvp'] to exclude those apps
 * 
 * 2. MAX_APPS_WITHOUT_CONFIRM: Maximum apps to start without warning
 *    - If starting more than this, script will warn and require --force flag
 *    - Default: 3 (safe for most Macs)
 * 
 * 3. START_DELAY_MS: Delay between starting each app (milliseconds)
 *    - Prevents resource spikes from simultaneous starts
 *    - Default: 3000ms (3 seconds)
 */
const EXCLUDED_APPS = [
  // Add app IDs here to exclude from auto-start
  // Example: 'all', 'nocss', 'mvp', 'tailwind', 'allcss', 'bootstrap', 'chakra', 'material', 'radix', 'shadcn', 'unocss'
  // Currently: Only 'web' and 'docs' will start by default (safest)
  // TEMPORARILY REDUCED FOR TESTING WARNING - will restore after test
  'all',
  'nocss',
  'mvp',
  'tailwind',
  'allcss',
  'bootstrap',
  'chakra',
  'material',
  'radix',
  'shadcn',
  'unocss',
  'landing',
];

const MAX_APPS_WITHOUT_CONFIRM = 3; // Start max 3 apps without --force flag
const START_DELAY_MS = 3000; // 3 second delay between app starts

/**
 * Discover all apps from apps directory
 */
async function discoverApps() {
  const entries = await readdir(APPS_DIR, { withFileTypes: true });
  const apps = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const appPath = join(APPS_DIR, entry.name);
      const packageJsonPath = join(appPath, 'package.json');
      
      try {
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
        const devScript = packageJson.scripts?.dev;
        
        if (devScript) {
          // Extract port from dev script (e.g., "next dev -p 3000" or "next dev --port 3000")
          const portMatch = devScript.match(/(?:-p|--port)\s+(\d+)/);
          const port = portMatch ? parseInt(portMatch[1], 10) : null;
          
          apps.push({
            id: entry.name,
            name: packageJson.name || entry.name,
            path: appPath,
            port,
            devScript,
            packageJson,
          });
        }
      } catch (error) {
        // Skip if package.json doesn't exist or can't be read
      }
    }
  }
  
  return apps.sort((a, b) => (a.port || 0) - (b.port || 0));
}

/**
 * Check if a port is in use
 */
async function isPortInUse(port) {
  if (!port) return false;
  try {
    const { stdout } = await execAsync(`lsof -ti:${port} 2>/dev/null || true`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Check if a process is running for an app
 */
async function isAppRunning(app) {
  if (!app.port) return false;
  return await isPortInUse(app.port);
}

/**
 * Get status of all apps
 */
async function getStatus() {
  const apps = await discoverApps();
  const statuses = await Promise.all(
    apps.map(async (app) => ({
      ...app,
      running: await isAppRunning(app),
    }))
  );
  return statuses;
}

/**
 * Start an app
 */
async function startApp(app) {
  if (await isAppRunning(app)) {
    return { success: true, message: `Already running on port ${app.port}` };
  }
  
  try {
    // Use spawn with detached process for proper background execution
    const child = spawn('pnpm', ['dev'], {
      cwd: app.path,
      detached: true,
      stdio: 'ignore',
    });
    
    // Unref so parent process can exit
    child.unref();
    
    // Give it a moment to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    const running = await isAppRunning(app);
    
    return {
      success: running,
      message: running ? `Started on port ${app.port}` : `Starting... (check status)`,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Stop an app
 */
async function stopApp(app) {
  if (!await isAppRunning(app)) {
    return { success: false, message: 'Not running' };
  }
  
  try {
    await execAsync(`lsof -ti:${app.port} | xargs kill -9 2>/dev/null || true`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const stillRunning = await isAppRunning(app);
    
    return {
      success: !stillRunning,
      message: stillRunning ? 'Failed to stop' : 'Stopped',
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Restart an app
 */
async function restartApp(app) {
  await stopApp(app);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return await startApp(app);
}

/**
 * Display status table
 */
function displayStatus(statuses) {
  console.log('\n📊 IdeaI Monorepo - Dev Server Status\n');
  console.log('┌─────────────┬──────────┬─────────┬─────────────────────────┐');
  console.log('│ App         │ Port     │ Status  │ URL                     │');
  console.log('├─────────────┼──────────┼─────────┼─────────────────────────┤');
  
  for (const app of statuses) {
    const status = app.running ? '🟢 Running' : '🔴 Stopped';
    const port = app.port ? app.port.toString().padEnd(8) : 'N/A     ';
    const url = app.port ? `http://localhost:${app.port}` : 'N/A';
    const appName = app.id.padEnd(11);
    
    console.log(`│ ${appName} │ ${port} │ ${status.padEnd(7)} │ ${url.padEnd(23)} │`);
  }
  
  console.log('└─────────────┴──────────┴─────────┴─────────────────────────┘');
  
  const running = statuses.filter(a => a.running).length;
  const total = statuses.length;
  console.log(`\n${running}/${total} apps running\n`);
}

/**
 * Main CLI handler
 */
async function main() {
  const [command, ...args] = process.argv.slice(2);
  
  if (!command) {
    console.log(`
Usage: node scripts/dev-manager.mjs <command> [app-id] [--force]

Commands:
  status              Show status of all apps
  start [app-id]      Start apps (safely limited by default)
  stop [app-id]       Stop all apps or specific app
  restart [app-id]    Restart all apps or specific app
  
Options:
  --force, -f         Start all apps (bypasses safety limits)
  
Examples:
  node scripts/dev-manager.mjs status
  node scripts/dev-manager.mjs start          # Start safe apps only (web, docs)
  node scripts/dev-manager.mjs start web      # Start specific app
  node scripts/dev-manager.mjs start --force  # Start ALL apps (dangerous!)
  node scripts/dev-manager.mjs stop docs
  node scripts/dev-manager.mjs restart

Safety:
  By default, only essential apps start (web, docs).
  Other apps are excluded to prevent Mac crashes.
  Edit EXCLUDED_APPS in dev-manager.mjs to change this.
`);
    process.exit(0);
  }
  
  const apps = await discoverApps();
  
  if (command === 'status') {
    const statuses = await getStatus();
    displayStatus(statuses);
    return;
  }
  
  // Parse arguments: app-id might be first, or --force might be first
  const forceFlag = args.includes('--force') || args.includes('-f');
  const targetAppId = args.find(arg => !arg.startsWith('--') && arg !== '-f');
  
  // Filter apps based on target
  let targetApps = targetAppId
    ? apps.filter(a => a.id === targetAppId)
    : apps;
  
  // Apply exclusions when starting all apps (unless --force)
  if (!targetAppId && command === 'start' && !forceFlag) {
    targetApps = targetApps.filter(a => !EXCLUDED_APPS.includes(a.id));
  }
  
  if (targetAppId && targetApps.length === 0) {
    console.error(`❌ App not found: ${targetAppId}`);
    console.log(`Available apps: ${apps.map(a => a.id).join(', ')}`);
    process.exit(1);
  }
  
  // Safety check: warn if starting too many apps
  if (command === 'start' && targetApps.length > MAX_APPS_WITHOUT_CONFIRM && !forceFlag) {
    console.error(`\n⚠️  WARNING: Attempting to start ${targetApps.length} apps at once!`);
    console.error(`   This can crash your Mac (each Next.js app uses ~300MB RAM).`);
    console.error(`\n   Apps to start: ${targetApps.map(a => a.id).join(', ')}`);
    console.error(`\n   To proceed anyway, use: pnpm dev:start --force`);
    console.error(`   Or start specific apps: pnpm dev:start web`);
    console.error(`\n   Excluded apps (safe to start manually): ${EXCLUDED_APPS.join(', ')}\n`);
    process.exit(1);
  }
  
  // Show what will be started
  if (command === 'start' && !targetAppId) {
    const excludedCount = apps.length - targetApps.length;
    if (excludedCount > 0) {
      console.log(`\n📋 Starting ${targetApps.length} apps (${excludedCount} excluded for safety)`);
      console.log(`   Included: ${targetApps.map(a => a.id).join(', ')}`);
      if (excludedCount > 0) {
        console.log(`   Excluded: ${EXCLUDED_APPS.filter(id => apps.some(a => a.id === id)).join(', ')}`);
      }
      console.log(`\n   To start all apps: pnpm dev:start --force\n`);
    }
  }
  
  console.log(`\n${command.toUpperCase()}: ${targetAppId || `${targetApps.length} apps`}\n`);
  
  // Start apps with delay to prevent resource spikes
  for (let i = 0; i < targetApps.length; i++) {
    const app = targetApps[i];
    
    // Add delay between starts (except first app)
    if (command === 'start' && i > 0) {
      console.log(`⏳ Waiting ${START_DELAY_MS / 1000}s before starting next app...`);
      await new Promise(resolve => setTimeout(resolve, START_DELAY_MS));
    }
    let result;
    
    switch (command) {
      case 'start':
        result = await startApp(app);
        break;
      case 'stop':
        result = await stopApp(app);
        break;
      case 'restart':
        result = await restartApp(app);
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
    
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${app.id.padEnd(12)} (port ${app.port || 'N/A'}) - ${result.message}`);
  }
  
  if (command === 'start' || command === 'restart') {
    console.log('\n⏳ Waiting 2 seconds for servers to start...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const statuses = await getStatus();
    displayStatus(statuses);
  }
  
  // Exit immediately - processes run in background
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
