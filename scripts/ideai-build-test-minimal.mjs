#!/usr/bin/env node

/**
 * @fileoverview Minimal test - Start nothing, just verify system is stable
 * @location scripts/ideai-build-test-minimal.mjs
 */

import { initLog, log, logError } from './ideai-boot-logger-dev.mjs';

async function main() {
  initLog();
  log('=== MINIMAL TEST STARTED ===');
  log('Testing system stability without starting any servers');
  
  try {
    log('Step 1: Testing logger');
    log('Step 2: Testing imports');
    log('Step 3: Testing file system access');
    
    const { readdir } = await import('fs/promises');
    const apps = await readdir('./apps');
    log(`Found ${apps.length} apps in directory`);
    
    log('Step 4: All tests passed');
    log('=== MINIMAL TEST COMPLETE ===');
    process.exit(0);
  } catch (error) {
    logError('Test failed', error);
    process.exit(1);
  }
}

main();


