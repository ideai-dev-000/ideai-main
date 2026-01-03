#!/usr/bin/env node
/**
 * @fileoverview Verify Script Organization
 * Checks that all scripts are properly organized
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCRIPTS_DIR = __dirname;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

// Expected structure
const expectedFiles = {
  'ideai-boot/modules/boot-logger.mjs': 'Boot session logging',
  'ideai-boot/boot-manager.mjs': 'Step-by-step boot orchestrator',
  'ideai-boot/modules/cleanup-logs.mjs': 'Cleanup boot log files',
  'ideai-boot/modules/dev-logger.mjs': 'Dev server operation logging',
  'ideai-boot/dev-server-manager.mjs': 'Dev server lifecycle management',
  'ideai-build/modules/dependency-sync.mjs': 'Sync child dependencies to parent',
  'ideai-build/modules/build-tracker.mjs': 'Track builds and dependencies',
  'ideai-build/modules/metadata-reader.mjs': 'Read .ideai.json metadata files',
  'ideai-build/modules/quick-test.mjs': 'Quick test for dev servers',
  'ideai-build/modules/test-minimal.mjs': 'Minimal system test',
  'ideai-build/modules/test-parent-child.js': 'Test parent-child app architecture',
  'ideai-build/modules/verify-all.sh': 'Verify all build checks',
  'ideai-develop/modules/vercel-linker.mjs': 'Link apps to Vercel projects',
  'ideai-develop/modules/setup-secrets.sh': 'Setup environment secrets',
  'ideai-develop/modules/setup-subdomain.sh': 'Setup subdomain configuration',
  'ideai-develop/modules/sync-docs.sh': 'Sync documentation files',
  'ideai-develop/modules/sync-vercel-github.sh': 'Sync Vercel to GitHub',
  'ideai-develop/modules/ignore-build-web.sh': 'Build ignore utilities',
  'ideai-useful/testing/test-local.mjs': 'Local testing script',
};

// Files that should be in root
const rootFiles = [
  'ideai-build.mjs',
  'README.md',
  'ORGANIZATION.md',
  'LOCAL-TESTING.md',
  'CLEANUP.md',
];

// Files that should be deleted (moved)
const obsoleteFiles = [
  'boot-logger.mjs',
  'boot-step-by-step.mjs',
  'cleanup-boot-logs.mjs',
  'dev-logger.mjs',
  'dev-manager.mjs',
  'ideai-build-sync.mjs',
  'ideai-build-track.mjs',
  'read-ideai-metadata.mjs',
  'read-ideai-metadata.ts',
  'quick-test.mjs',
  'test-minimal.mjs',
  'test-parent-child.js',
  'verify-all.sh',
  'ideai-vercel-link.mjs',
  'setup-secrets.sh',
  'setup-subdomain.sh',
  'sync-docs.sh',
  'sync-vercel-to-github.sh',
  'ignore-build-web.sh',
  'test-local.mjs',
];

console.log(colors.cyan + '🔍 Verifying Script Organization\n' + colors.reset);

// Check expected files
let found = 0;
let missing = 0;

console.log('Checking organized files...\n');
for (const [file, description] of Object.entries(expectedFiles)) {
  const path = join(SCRIPTS_DIR, file);
  if (existsSync(path)) {
    console.log(`${colors.green}✅${colors.reset} ${file}`);
    console.log(`   ${description}`);
    found++;
  } else {
    console.log(`${colors.red}❌${colors.reset} ${file} - MISSING`);
    missing++;
  }
}

// Check root files
console.log(`\nChecking root files...\n`);
let rootOk = 0;
for (const file of rootFiles) {
  const path = join(SCRIPTS_DIR, file);
  if (existsSync(path)) {
    console.log(`${colors.green}✅${colors.reset} ${file}`);
    rootOk++;
  } else {
    console.log(`${colors.yellow}⚠️${colors.reset} ${file} - Optional`);
  }
}

// Check obsolete files
console.log(`\nChecking for obsolete files in root...\n`);
let obsolete = 0;
for (const file of obsoleteFiles) {
  const path = join(SCRIPTS_DIR, file);
  if (existsSync(path)) {
    console.log(`${colors.yellow}⚠️${colors.reset} ${file} - Should be deleted`);
    obsolete++;
  }
}

// Summary
console.log(`\n${colors.cyan}📊 Summary:${colors.reset}\n`);
console.log(`   Organized files found: ${colors.green}${found}${colors.reset}`);
console.log(`   Organized files missing: ${colors.red}${missing}${colors.reset}`);
console.log(`   Root files OK: ${colors.green}${rootOk}${colors.reset}`);
console.log(`   Obsolete files in root: ${colors.yellow}${obsolete}${colors.reset}`);

if (missing === 0 && obsolete === 0) {
  console.log(`\n${colors.green}✅ All scripts properly organized!${colors.reset}`);
} else if (missing > 0) {
  console.log(`\n${colors.yellow}⚠️  Run: node scripts/organize-scripts.mjs${colors.reset}`);
} else {
  console.log(`\n${colors.yellow}⚠️  Delete obsolete files after verification (see CLEANUP.md)${colors.reset}`);
}


