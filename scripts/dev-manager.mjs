#!/usr/bin/env node

/**
 * @fileoverview Modern dev server manager for IdeaI monorepo
 * 
 * @description
 * Automatically discovers all apps, manages their lifecycle, and provides
 * status monitoring. 2027-facing, no bloat, best practices.
 * 
 * Usage:
 *   node scripts/dev-manager.mjs status    # Show status of all apps
 *   node scripts/dev-manager.mjs start     # Start all apps
 *   node scripts/dev-manager.mjs stop      # Stop all apps
 *   node scripts/dev-manager.mjs restart   # Restart all apps
 *   node scripts/dev-manager.mjs start web  # Start specific app
 *   node scripts/dev-manager.mjs stop docs # Stop specific app
 */

import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const APPS_DIR = join(REPO_ROOT, 'apps');

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
    const command = `cd ${app.path} && pnpm dev > /dev/null 2>&1 &`;
    exec(command, (error) => {
      if (error && !error.message.includes('background')) {
        console.error(`Error starting ${app.id}:`, error.message);
      }
    });
    
    // Wait a bit to check if it started
    await new Promise(resolve => setTimeout(resolve, 3000));
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
Usage: node scripts/dev-manager.mjs <command> [app-id]

Commands:
  status              Show status of all apps
  start [app-id]      Start all apps or specific app
  stop [app-id]       Stop all apps or specific app
  restart [app-id]    Restart all apps or specific app
  
Examples:
  node scripts/dev-manager.mjs status
  node scripts/dev-manager.mjs start
  node scripts/dev-manager.mjs start web
  node scripts/dev-manager.mjs stop docs
  node scripts/dev-manager.mjs restart
`);
    process.exit(0);
  }
  
  const apps = await discoverApps();
  
  if (command === 'status') {
    const statuses = await getStatus();
    displayStatus(statuses);
    return;
  }
  
  const targetAppId = args[0];
  const targetApps = targetAppId
    ? apps.filter(a => a.id === targetAppId)
    : apps;
  
  if (targetAppId && targetApps.length === 0) {
    console.error(`❌ App not found: ${targetAppId}`);
    console.log(`Available apps: ${apps.map(a => a.id).join(', ')}`);
    process.exit(1);
  }
  
  console.log(`\n${command.toUpperCase()}: ${targetAppId || 'all apps'}\n`);
  
  for (const app of targetApps) {
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
}

main().catch(console.error);

