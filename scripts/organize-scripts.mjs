#!/usr/bin/env node
/**
 * @fileoverview Script Organizer - Organizes and labels all scripts
 * 
 * @description
 * Moves all scripts to semantic folders and ensures they're properly labeled.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCRIPTS_DIR = join(__dirname);

// File mappings: [source, destination, category, description]
const fileMappings = [
  // Boot scripts
  ['boot-logger.mjs', 'ideai-boot/modules/boot-logger.mjs', 'boot', 'Boot session logging'],
  ['boot-step-by-step.mjs', 'ideai-boot/boot-manager.mjs', 'boot', 'Step-by-step boot orchestrator'],
  ['cleanup-boot-logs.mjs', 'ideai-boot/modules/cleanup-logs.mjs', 'boot', 'Cleanup boot log files'],
  ['dev-logger.mjs', 'ideai-boot/modules/dev-logger.mjs', 'boot', 'Dev server operation logging'],
  ['dev-manager.mjs', 'ideai-boot/dev-server-manager.mjs', 'boot', 'Dev server lifecycle management'],
  
  // Build scripts
  ['ideai-build-sync.mjs', 'ideai-build/modules/dependency-sync.mjs', 'build', 'Sync child dependencies to parent'],
  ['ideai-build-track.mjs', 'ideai-build/modules/build-tracker.mjs', 'build', 'Track builds and dependencies'],
  ['read-ideai-metadata.mjs', 'ideai-build/modules/metadata-reader.mjs', 'build', 'Read .ideai.json metadata files'],
  ['read-ideai-metadata.ts', 'ideai-build/modules/metadata-reader.ts', 'build', 'TypeScript metadata reader'],
  ['quick-test.mjs', 'ideai-build/modules/quick-test.mjs', 'build', 'Quick test for dev servers'],
  ['test-minimal.mjs', 'ideai-build/modules/test-minimal.mjs', 'build', 'Minimal system test'],
  ['test-parent-child.js', 'ideai-build/modules/test-parent-child.js', 'build', 'Test parent-child app architecture'],
  ['verify-all.sh', 'ideai-build/modules/verify-all.sh', 'build', 'Verify all build checks'],
  
  // Develop scripts
  ['ideai-vercel-link.mjs', 'ideai-develop/modules/vercel-linker.mjs', 'develop', 'Link apps to Vercel projects'],
  ['setup-secrets.sh', 'ideai-develop/modules/setup-secrets.sh', 'develop', 'Setup environment secrets'],
  ['setup-subdomain.sh', 'ideai-develop/modules/setup-subdomain.sh', 'develop', 'Setup subdomain configuration'],
  ['sync-docs.sh', 'ideai-develop/modules/sync-docs.sh', 'develop', 'Sync documentation files'],
  ['sync-vercel-to-github.sh', 'ideai-develop/modules/sync-vercel-github.sh', 'develop', 'Sync Vercel to GitHub'],
  ['ignore-build-web.sh', 'ideai-develop/modules/ignore-build-web.sh', 'develop', 'Build ignore utilities'],
  
  // Useful scripts
  ['test-local.mjs', 'ideai-useful/testing/test-local.mjs', 'useful', 'Local testing script'],
];

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Add label header to file if missing
 */
function ensureLabeled(filePath, category, description) {
  if (!existsSync(filePath)) return;
  
  const content = readFileSync(filePath, 'utf-8');
  
  // Check if already has @fileoverview
  if (content.includes('@fileoverview')) {
    return; // Already labeled
  }
  
  // Add label header
  const ext = filePath.split('.').pop();
  const isScript = ['mjs', 'js', 'ts'].includes(ext);
  const shebang = isScript ? '#!/usr/bin/env node\n' : '';
  
  const label = `/**
 * @fileoverview ${description}
 * 
 * @category ${category}
 * @description
 * ${description}
 * 
 * @module ${basename(filePath, '.' + ext).replace(/-/g, '')}
 */
`;

  const newContent = shebang + label + '\n' + content;
  writeFileSync(filePath, newContent, 'utf-8');
}

/**
 * Organize files
 */
function organizeFiles() {
  console.log('📁 Organizing scripts...\n');
  
  let moved = 0;
  let labeled = 0;
  let skipped = 0;
  
  for (const [source, dest, category, description] of fileMappings) {
    const sourcePath = join(SCRIPTS_DIR, source);
    const destPath = join(SCRIPTS_DIR, dest);
    
    if (!existsSync(sourcePath)) {
      console.log(`⏭️  Skipped: ${source} (not found)`);
      skipped++;
      continue;
    }
    
    // Ensure destination directory exists
    ensureDir(dirname(destPath));
    
    // Copy file
    copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied: ${source} → ${dest}`);
    moved++;
    
    // Ensure file is labeled
    ensureLabeled(destPath, category, description);
    labeled++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Moved: ${moved}`);
  console.log(`   Labeled: ${labeled}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`\n✅ Organization complete!`);
  console.log(`\n⚠️  Old files still in root. Delete after verification.`);
  console.log(`   See scripts/CLEANUP.md for cleanup steps.`);
}

// Run
organizeFiles();

