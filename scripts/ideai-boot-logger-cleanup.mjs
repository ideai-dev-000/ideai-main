#!/usr/bin/env node

/**
 * @fileoverview Cleanup Boot Logs - Remove all boot log files
 * 
 * @description
 * Removes the .boot-logs/ directory and all numbered log files.
 * Use this to clean up after debugging is complete.
 * 
 * Usage:
 *   node scripts/ideai-boot-logger-cleanup.mjs        # Remove all boot logs
 *   node scripts/ideai-boot-logger-cleanup.mjs --dry   # Show what would be deleted
 * @location scripts/ideai-boot-logger-cleanup.mjs
 */

import { readdir, stat, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");
const BOOT_LOGS_DIR = join(REPO_ROOT, '.boot-logs');

async function cleanupBootLogs(dryRun = false) {
  if (!existsSync(BOOT_LOGS_DIR)) {
    console.log('✅ No boot logs directory found. Nothing to clean up.');
    return;
  }
  
  const files = await readdir(BOOT_LOGS_DIR);
  const fileCount = files.length;
  
  if (fileCount === 0) {
    console.log('✅ Boot logs directory is empty. Nothing to clean up.');
    return;
  }
  
  if (dryRun) {
    console.log(`\n📋 Would delete ${fileCount} files from .boot-logs/:\n`);
    for (const file of files) {
      const filePath = join(BOOT_LOGS_DIR, file);
      const stats = await stat(filePath);
      console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB)`);
    }
    console.log(`\nRun without --dry to actually delete.\n`);
    return;
  }
  
  console.log(`\n🗑️  Deleting ${fileCount} boot log files...\n`);
  
  try {
    await rm(BOOT_LOGS_DIR, { recursive: true, force: true });
    console.log('✅ Boot logs directory removed successfully.\n');
  } catch (error) {
    console.error('❌ Failed to remove boot logs:', error.message);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry') || args.includes('--dry-run');
  
  await cleanupBootLogs(dryRun);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});


