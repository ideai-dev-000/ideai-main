#!/usr/bin/env node

/**
 * @fileoverview Quick test - Start web app and verify it responds
 * 
 * @description
 * Quick test script to verify the defensive mechanisms work.
 * Starts web app, waits for health check, verifies it responds.
 * If it hangs, the health check will kill it automatically.
 * @location scripts/ideai-build-test-quick.mjs
 */

import { initLog, log } from './ideai-boot-logger-dev.mjs';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function healthCheck(port, maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const { stdout } = await execAsync(
        `curl -s -o /dev/null -w "%{http_code}" --max-time 2 --connect-timeout 2 http://localhost:${port} 2>/dev/null || echo "000"`,
        { timeout: 3000 }
      );
      const statusCode = parseInt(stdout.trim(), 10);
      if (statusCode > 0 && statusCode < 500) {
        return true;
      }
    } catch (error) {
      // Continue
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return false;
}

async function main() {
  initLog();
  log('=== QUICK TEST STARTED ===');
  
  const port = 3000;
  const appPath = './apps/web';
  
  // Kill any existing process
  try {
    await execAsync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
    log('Cleaned up any existing process');
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {
    // Ignore
  }
  
  log(`Starting web app on port ${port}...`);
  const child = spawn('pnpm', ['dev'], {
    cwd: appPath,
    detached: true,
    stdio: 'ignore',
  });
  
  child.unref();
  log(`Process spawned, PID: ${child.pid}`);
  
  log('Waiting 5 seconds for initial startup...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  log('Starting health check (max 30s)...');
  const healthy = await healthCheck(port, 15);
  
  if (healthy) {
    log('✅ SUCCESS: Server is responding!');
    log('Test passed - server started and is healthy');
    process.exit(0);
  } else {
    log('❌ FAILED: Server did not respond within 30s');
    log('Killing process...');
    try {
      await execAsync(`kill -9 ${child.pid} 2>/dev/null || true`);
      await execAsync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`);
      log('Process killed');
    } catch (e) {
      log(`Error killing process: ${e.message}`);
    }
    log('Test failed - server did not respond');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});


