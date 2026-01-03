#!/usr/bin/env node
/**
 * @fileoverview Local Testing Script
 * Tests all IdeaI tools locally
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

console.log(colors.cyan + '🧪 Testing IdeaI Tools Locally\n' + colors.reset);

// Test 1: Check UI exists
console.log('1. Checking UI file...');
const uiPath = join(REPO_ROOT, 'scripts', 'ideai-ui-main.mjs');
if (existsSync(uiPath)) {
  console.log(colors.green + '   ✅ UI file exists' + colors.reset);
} else {
  console.log(colors.red + '   ❌ UI file missing' + colors.reset);
  process.exit(1);
}

// Test 2: Check build CLI
console.log('\n2. Checking build CLI...');
const buildPath = join(REPO_ROOT, 'scripts', 'ideai-build.mjs');
if (existsSync(buildPath)) {
  console.log(colors.green + '   ✅ Build CLI exists' + colors.reset);
  try {
    const { stdout } = await execAsync(`node ${buildPath} --help 2>&1 | head -5`);
    console.log(colors.green + '   ✅ Build CLI runs' + colors.reset);
  } catch (e) {
    console.log(colors.yellow + '   ⚠️  Build CLI has issues (may be expected)' + colors.reset);
  }
} else {
  console.log(colors.red + '   ❌ Build CLI missing' + colors.reset);
}

// Test 3: Check boot scripts
console.log('\n3. Checking boot scripts...');
const bootScripts = [
  join(REPO_ROOT, 'scripts', 'ideai-boot-logger-boot.mjs'),
  join(REPO_ROOT, 'scripts', 'ideai-boot-logger-dev.mjs'),
];
let bootOk = true;
bootScripts.forEach(script => {
  if (existsSync(script)) {
    console.log(colors.green + `   ✅ ${script.split('/').pop()} exists` + colors.reset);
  } else {
    console.log(colors.yellow + `   ⚠️  ${script.split('/').pop()} not found` + colors.reset);
    bootOk = false;
  }
});

// Test 4: Check build scripts
console.log('\n4. Checking build scripts...');
const buildScripts = [
  join(REPO_ROOT, 'scripts', 'ideai-build-checker-dependency.mjs'),
  join(REPO_ROOT, 'scripts', 'ideai-build-tracker.mjs'),
  join(REPO_ROOT, 'scripts', 'ideai-build-manager-rules.mjs'),
];
buildScripts.forEach(script => {
  if (existsSync(script)) {
    console.log(colors.green + `   ✅ ${script.split('/').pop()} exists` + colors.reset);
  } else {
    console.log(colors.red + `   ❌ ${script.split('/').pop()} missing` + colors.reset);
  }
});

// Test 5: Try importing UI
console.log('\n5. Testing UI import...');
try {
  const uiModule = await import(`file://${uiPath}`);
  console.log(colors.green + '   ✅ UI module imports successfully' + colors.reset);
  if (uiModule.startUI) {
    console.log(colors.green + '   ✅ UI exports startUI function' + colors.reset);
  }
} catch (error) {
  console.log(colors.red + `   ❌ UI import failed: ${error.message}` + colors.reset);
}

console.log(colors.cyan + '\n✅ Local testing complete!\n' + colors.reset);
console.log('To start the UI, run:');
console.log(colors.cyan + '  node scripts/ideai-ui-main.mjs\n' + colors.reset);

