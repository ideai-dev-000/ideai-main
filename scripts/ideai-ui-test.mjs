#!/usr/bin/env node
/**
 * @fileoverview Test script for IdeaI UI
 * Quick test to verify UI loads and paths are correct
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');

console.log('🧪 Testing IdeaI UI Setup\n');

// Check required files
const checks = [
  { name: 'UI Main File', path: join(__dirname, 'ideai-ui-main.mjs') },
  { name: 'Build CLI', path: join(REPO_ROOT, 'scripts', 'ideai-build.mjs') },
  { name: 'Build Scripts', path: join(REPO_ROOT, 'scripts') },
];

let allPassed = true;

console.log('Checking files...\n');
checks.forEach(check => {
  const exists = existsSync(check.path);
  const icon = exists ? '✅' : '❌';
  const color = exists ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${icon}\x1b[0m ${check.name}: ${check.path}`);
  if (!exists) allPassed = false;
});

console.log('');

// Test imports
console.log('Testing imports...\n');
try {
  const uiModule = await import(`file://${join(__dirname, 'ideai-ui-main.mjs')}`);
  console.log('✅ UI module imports successfully');
  console.log(`   Exports: ${Object.keys(uiModule).join(', ')}`);
} catch (error) {
  console.error('❌ UI module import failed:', error.message);
  allPassed = false;
}

console.log('');

if (allPassed) {
  console.log('✅ All checks passed! UI is ready to use.');
  console.log('\nRun: node scripts/ideai-ui-main.mjs');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
}

