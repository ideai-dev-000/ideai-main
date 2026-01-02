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
 * - Build checks before starting dev servers
 * - Health checks with timeouts to prevent hanging
 * - Real-time memory monitoring (2GB limit per process)
 * - Automatic bail-out if apps don't respond OR memory maxes out
 * 
 * Usage:
 *   node scripts/dev-manager.mjs status         # Show status of all apps
 *   node scripts/dev-manager.mjs start          # Start safe apps only (web, docs)
 *   node scripts/dev-manager.mjs start web      # Start specific app
 *   node scripts/dev-manager.mjs start --force  # Start ALL apps (dangerous!)
 *   node scripts/dev-manager.mjs stop           # Stop all apps
 *   node scripts/dev-manager.mjs stop docs      # Stop specific app
 *   node scripts/dev-manager.mjs restart        # Restart all apps
 *   node scripts/dev-manager.mjs build-check    # Check if apps can build
 * 
 * Configuration:
 *   Edit EXCLUDED_APPS array (line ~49) to exclude apps from auto-start
 *   Edit MAX_APPS_WITHOUT_CONFIRM (line ~67) to change safety limit
 *   Edit START_DELAY_MS (line ~68) to change delay between starts
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';
import { initLog, log, logError, logStep, logCommand, logAppOperation } from './dev-logger.mjs';
import { checkMemoryAndBail, getMemorySnapshot } from './memory-monitor.mjs';

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
 * 
 * 4. HEALTH_CHECK_TIMEOUT_MS: Maximum time to wait for app to respond
 *    - If app doesn't respond within this time, bail out
 *    - Default: 30000ms (30 seconds)
 * 
 * 5. BUILD_CHECK_TIMEOUT_MS: Maximum time to wait for build check
 *    - Default: 60000ms (60 seconds)
 */
const EXCLUDED_APPS = [
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

const MAX_APPS_WITHOUT_CONFIRM = 3;
const START_DELAY_MS = 3000;
const HEALTH_CHECK_TIMEOUT_MS = 30000; // 30 seconds MAX - bail out after this
const BUILD_CHECK_TIMEOUT_MS = 60000; // 60 seconds
const HEALTH_CHECK_INTERVAL_MS = 2000; // Check every 2 seconds
const MAX_COMPILATION_WAIT_MS = 60000; // 60 seconds max for Next.js to compile
const BAIL_OUT_AFTER_MS = 90000; // 90 seconds total - if not ready, kill and bail
const MAX_MEMORY_MB = 2048; // 2GB max memory per process - bail if exceeded
const MEMORY_CHECK_INTERVAL_MS = 3000; // Check memory every 3 seconds

/**
 * Read .ideai.json config for an app
 */
async function readIdeAIConfig(appId) {
  const configPath = join(APPS_DIR, appId, '.ideai.json');
  try {
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Get apps to start based on .ideai.json config
 * Reads from root web app's .ideai.json to determine which apps should run
 */
async function getAppsFromConfig() {
  const webConfig = await readIdeAIConfig('web');
  if (!webConfig || !webConfig.childApps) {
    return ['web', 'docs']; // Default fallback
  }
  
  // Start parent (web) + configured child apps
  return ['web', ...webConfig.childApps.filter(id => !EXCLUDED_APPS.includes(id))];
}

/**
 * Discover all apps from apps directory
 */
async function discoverApps() {
  logStep('Discovering apps', `Reading directory: ${APPS_DIR}`);
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
          // Extract port from dev script or .ideai.json
          const portMatch = devScript.match(/(?:-p|--port)\s+(\d+)/);
          let port = portMatch ? parseInt(portMatch[1], 10) : null;
          
          // Try to get port from .ideai.json
          const config = await readIdeAIConfig(entry.name);
          if (config?.localPort || config?.metadata?.port) {
            port = config.localPort || config.metadata?.port;
          }
          
          apps.push({
            id: entry.name,
            name: packageJson.name || entry.name,
            path: appPath,
            port,
            devScript,
            packageJson,
          });
          log(`Found app: ${entry.name} (port: ${port || 'N/A'})`);
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
 * Get process memory usage in MB
 */
async function getProcessMemoryMB(pid) {
  if (!pid) return null;
  try {
    // Use ps to get RSS (Resident Set Size) in KB, convert to MB
    const { stdout } = await execAsync(`ps -o rss= -p ${pid} 2>/dev/null || echo "0"`);
    const rssKB = parseInt(stdout.trim(), 10);
    if (isNaN(rssKB) || rssKB === 0) return null;
    return Math.round(rssKB / 1024); // Convert KB to MB
  } catch {
    return null;
  }
}

/**
 * Health check - verify app is actually responding (not just port bound)
 * CRITICAL: This prevents hangs by checking if server actually responds to HTTP
 * Also monitors memory in real-time and bails if memory maxes out
 */
async function healthCheck(app, timeout = HEALTH_CHECK_TIMEOUT_MS, processPid = null) {
  if (!app.port) {
    log(`Health check skipped: no port for ${app.id}`, 'WARN');
    return false;
  }
  
  const startTime = Date.now();
  let attempts = 0;
  const maxAttempts = Math.floor(timeout / HEALTH_CHECK_INTERVAL_MS);
  let lastMemoryCheck = 0;
  let memoryExceeded = false;
  
  log(`Health check started: ${app.id} on port ${app.port}, max ${maxAttempts} attempts`);
  if (processPid) {
    log(`Memory monitoring enabled for PID ${processPid} (max ${MAX_MEMORY_MB}MB)`);
  }
  
  while (Date.now() - startTime < timeout && !memoryExceeded) {
    attempts++;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    // Check memory every MEMORY_CHECK_INTERVAL_MS
    if (processPid && (Date.now() - lastMemoryCheck) >= MEMORY_CHECK_INTERVAL_MS) {
      lastMemoryCheck = Date.now();
      
      // CRITICAL: Check Cursor memory first - prevent 70GB leaks!
      try {
        const cursorGB = await checkMemoryAndBail();
        if (cursorGB > 4) {
          log(`⚠️  Cursor memory high: ${cursorGB}GB - monitoring closely`, 'WARN');
        }
      } catch (error) {
        log(`🚨 CRITICAL: ${error.message} - BAILING OUT to prevent crash`, 'ERROR');
        memoryExceeded = true;
        // Kill process immediately
        try {
          await execAsync(`kill -9 ${processPid} 2>/dev/null || true`);
          log(`Process ${processPid} killed due to Cursor memory limit`);
        } catch (e) {
          logError(`Failed to kill process ${processPid}`, e);
        }
        return false;
      }
      
      const memoryMB = await getProcessMemoryMB(processPid);
      if (memoryMB !== null) {
        if (memoryMB > MAX_MEMORY_MB) {
          log(`🚨 MEMORY EXCEEDED: ${app.id} (PID ${processPid}) using ${memoryMB}MB > ${MAX_MEMORY_MB}MB - BAILING OUT`, 'ERROR');
          memoryExceeded = true;
          // Kill process immediately
          try {
            await execAsync(`kill -9 ${processPid} 2>/dev/null || true`);
            log(`Process ${processPid} killed due to memory limit`);
          } catch (e) {
            logError(`Failed to kill process ${processPid}`, e);
          }
          return false;
        } else {
          // Log memory usage every 6 seconds (every 3rd check)
          if (attempts % 3 === 0) {
            log(`Memory check: ${app.id} (PID ${processPid}) using ${memoryMB}MB / ${MAX_MEMORY_MB}MB`);
          }
        }
      }
    }
    
    // Check HTTP response
    try {
      // Use curl to check if app is responding
      // CRITICAL: Check actual HTTP response, not just if port is bound
      // Try API route first (server-side, faster) then fallback to root
      let url = `http://localhost:${app.port}`;
      if (app.id === 'web') {
        // For web app, try API route first (doesn't trigger page compilation)
        url = `http://localhost:${app.port}/api/apps-index`;
      }
      const { stdout } = await execAsync(
        `curl -s -o /dev/null -w "%{http_code}" --max-time 2 --connect-timeout 2 ${url} 2>/dev/null || echo "000"`,
        { timeout: 3000 }
      );
      const statusCode = parseInt(stdout.trim(), 10);
      
      if (statusCode > 0 && statusCode < 500) {
        log(`Health check PASSED: ${app.id} responded with HTTP ${statusCode} after ${elapsed}s (${attempts} attempts)`);
        return true;
      }
      
      // Log progress every 10 seconds
      if (attempts % 5 === 0) {
        const memoryInfo = processPid ? ` (checking memory...)` : '';
        log(`Health check in progress: ${app.id} - ${elapsed}s elapsed, ${attempts}/${maxAttempts} attempts (status: ${statusCode})${memoryInfo}`);
      }
    } catch (error) {
      // Not ready yet, continue checking
      if (attempts % 5 === 0) {
        log(`Health check waiting: ${app.id} - ${elapsed}s elapsed (error: ${error.message})`);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, HEALTH_CHECK_INTERVAL_MS));
  }
  
  if (memoryExceeded) {
    log(`Health check FAILED: ${app.id} exceeded memory limit`, 'ERROR');
    return false;
  }
  
  log(`Health check TIMEOUT: ${app.id} did not respond after ${timeout}ms`, 'ERROR');
  return false;
}

/**
 * Quick build check - verify app can build (type check only)
 */
async function buildCheck(app, timeout = BUILD_CHECK_TIMEOUT_MS) {
  try {
    // Check if check-types script exists
    const hasCheckTypes = app.packageJson?.scripts?.['check-types'];
    if (!hasCheckTypes) {
      return { success: true, message: 'No check-types script (skipped)' };
    }
    
    const checkPromise = execAsync('pnpm check-types', {
      cwd: app.path,
      timeout,
    });
    
    await checkPromise;
    return { success: true, message: 'Build check passed' };
  } catch (error) {
    // Don't fail on build check errors - just warn
    return { 
      success: false, 
      message: `Type check failed (non-blocking)` 
    };
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
 * Start an app with health check and timeout
 * CRITICAL: Includes automatic bail-out to prevent Mac crashes
 */
async function startApp(app, options = {}) {
  const { skipBuildCheck = false, skipHealthCheck = false } = options;
  const startTime = Date.now();
  let processPid = null;
  let bailOutFired = false; // Flag to prevent double-kill if bail-out fires
  
  logAppOperation('start', app.id, `port ${app.port}, skipBuildCheck: ${skipBuildCheck}, skipHealthCheck: ${skipHealthCheck}`);
  
  if (await isAppRunning(app)) {
    log(`App ${app.id} already running`);
    return { success: true, message: `Already running on port ${app.port}` };
  }
  
  // Set up bail-out timer - if we exceed max time, kill process and bail
  const bailOutTimer = setTimeout(async () => {
    if (processPid && !bailOutFired) {
      bailOutFired = true;
      log(`BAIL-OUT: ${app.id} exceeded ${BAIL_OUT_AFTER_MS}ms - killing process ${processPid}`, 'ERROR');
      try {
        await execAsync(`kill -9 ${processPid} 2>/dev/null || true`);
        log(`Process ${processPid} killed by bail-out timer`);
      } catch (e) {
        logError(`Failed to kill process ${processPid}`, e);
      }
    }
  }, BAIL_OUT_AFTER_MS);
  
  // Optional build check (with timeout to prevent hangs)
  if (!skipBuildCheck) {
    logStep('Build check', app.id);
    try {
      const buildResult = await Promise.race([
        buildCheck(app),
        new Promise((resolve) => 
          setTimeout(() => resolve({ success: false, message: 'Build check timeout' }), BUILD_CHECK_TIMEOUT_MS)
        )
      ]);
      
      if (!buildResult.success) {
        log(`Build check warning: ${buildResult.message}`, 'WARN');
        console.warn(`⚠️  ${app.id}: ${buildResult.message}`);
        console.warn(`   Starting anyway, but may have issues...`);
      } else {
        log(`Build check passed: ${app.id}`);
      }
    } catch (error) {
      logError(`Build check error for ${app.id}`, error);
      console.warn(`⚠️  ${app.id}: Build check failed, starting anyway...`);
    }
  }
  
  try {
    logStep('Spawning process', `${app.id} in ${app.path}`);
    console.log(`🚀 Starting ${app.id} on port ${app.port}...`);
    
    logCommand('pnpm', ['dev']);
    // Use spawn with detached process for proper background execution
    const child = spawn('pnpm', ['dev'], {
      cwd: app.path,
      detached: true,
      stdio: 'ignore',
    });
    
    processPid = child.pid;
    log(`Process spawned for ${app.id}, PID: ${processPid}`);
    
    // Unref so parent process can exit
    child.unref();
    
    // Give it a moment to start
    logStep('Waiting for process', `${app.id} - 2 second delay`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // CRITICAL: Always do health check (even if skipHealthCheck is true, do a quick one)
    // This prevents the Mac crash by detecting if server is actually ready
    // Also monitors memory in real-time to prevent memory leaks
    logStep('Health check', `${app.id} on port ${app.port}`);
    console.log(`⏳ Waiting for ${app.id} to be ready (max ${HEALTH_CHECK_TIMEOUT_MS/1000}s, monitoring memory)...`);
    
    const healthy = await healthCheck(app, skipHealthCheck ? 10000 : HEALTH_CHECK_TIMEOUT_MS, processPid);
    
    // Clear bail-out timer if we got here (health check completed)
    // This prevents the bail-out timer from firing after we've already handled the result
    clearTimeout(bailOutTimer);
    
    if (healthy) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      log(`✅ ${app.id} is healthy after ${elapsed}s`);
      return {
        success: true,
        message: `Started and healthy on port ${app.port} (ready in ${elapsed}s)`,
      };
    } else {
      // Health check failed - this is where we used to hang and crash
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      log(`⚠️  Health check failed: ${app.id} not responding after ${elapsed}s`, 'WARN');
      
      // CRITICAL: Always kill process if health check fails
      // This prevents the Mac crash - don't leave hung processes running
      log(`❌ BAIL-OUT: ${app.id} failed health check - killing process to prevent hang`, 'ERROR');
      try {
        if (processPid && !bailOutFired) {
          await execAsync(`kill -9 ${processPid} 2>/dev/null || true`);
          log(`Process ${processPid} killed due to health check failure`);
          
          // Wait a moment for process to die
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify it's dead
          const stillRunning = await isAppRunning(app);
          if (stillRunning) {
            log(`⚠️  Process ${processPid} still running after kill - trying again`, 'WARN');
            await execAsync(`lsof -ti:${app.port} | xargs kill -9 2>/dev/null || true`);
          }
        }
      } catch (e) {
        logError(`Failed to kill hung process`, e);
      }
      
      return {
        success: false,
        message: `Failed: ${app.id} did not respond after ${elapsed}s (killed to prevent hang)`,
      };
    }
  } catch (error) {
    clearTimeout(bailOutTimer);
    logError(`Failed to start ${app.id}`, error);
    
    // Try to kill process if we have PID and bail-out hasn't already fired
    if (processPid && !bailOutFired) {
      try {
        await execAsync(`kill -9 ${processPid} 2>/dev/null || true`);
        log(`Cleaned up process ${processPid} after error`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    
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
  // Initialize logging first
  initLog();
  log('Dev Manager Started');
  log(`Command line args: ${process.argv.slice(2).join(' ')}`);
  
  const [command, ...args] = process.argv.slice(2);
  
  if (!command) {
    console.log(`
Usage: node scripts/dev-manager.mjs <command> [app-id] [--force] [--skip-build] [--skip-health]

Commands:
  status              Show status of all apps
  start [app-id]      Start apps (safely limited by default)
  stop [app-id]       Stop all apps or specific app
  restart [app-id]    Restart all apps or specific app
  build-check         Check if apps can build (type check)
  
Options:
  --force, -f         Start all apps (bypasses safety limits)
  --skip-build        Skip build checks before starting
  --skip-health       Skip health checks after starting
  
Examples:
  node scripts/dev-manager.mjs status
  node scripts/dev-manager.mjs start          # Start safe apps only (web, docs)
  node scripts/dev-manager.mjs start web      # Start specific app
  node scripts/dev-manager.mjs start --force  # Start ALL apps (dangerous!)
  node scripts/dev-manager.mjs stop docs
  node scripts/dev-manager.mjs restart
  node scripts/dev-manager.mjs build-check

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
  
  if (command === 'build-check') {
    console.log('\n🔍 Running build checks for all apps...\n');
    const targetApps = args.includes('--force') ? apps : apps.filter(a => !EXCLUDED_APPS.includes(a.id));
    
    for (const app of targetApps) {
      const result = await buildCheck(app);
      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} ${app.id.padEnd(12)} - ${result.message}`);
    }
    return;
  }
  
  // Parse arguments
  const forceFlag = args.includes('--force') || args.includes('-f');
  const skipBuildCheck = args.includes('--skip-build');
  const skipHealthCheck = args.includes('--skip-health');
  const targetAppId = args.find(arg => !arg.startsWith('--') && arg !== '-f');
  
  // Filter apps based on target
  let targetApps = targetAppId
    ? apps.filter(a => a.id === targetAppId)
    : apps;
  
  // Apply exclusions when starting all apps (unless --force)
  // Or use .ideai.json config if available
  if (!targetAppId && command === 'start' && !forceFlag) {
    try {
      const configApps = await getAppsFromConfig();
      targetApps = apps.filter(a => configApps.includes(a.id));
    } catch {
      // Fallback to exclusion list
      targetApps = targetApps.filter(a => !EXCLUDED_APPS.includes(a.id));
    }
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
        result = await startApp(app, { skipBuildCheck, skipHealthCheck });
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
  logError('Fatal error in main', error);
  console.error('❌ Error:', error.message);
  process.exit(1);
});

// Log process exit
process.on('exit', (code) => {
  log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (error) => {
  logError('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled rejection', reason);
  process.exit(1);
});

