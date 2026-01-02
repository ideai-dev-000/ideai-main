#!/usr/bin/env node

/**
 * @fileoverview Step-by-step boot script with checkpoint tracking
 * 
 * @description
 * Boots the IdeaI monorepo step-by-step with checkpoint tracking.
 * If the process crashes, you can resume from the last checkpoint.
 * Each step is logged and tracked in .boot-checkpoint.json
 * 
 * Usage:
 *   node scripts/boot-step-by-step.mjs          # Start from beginning or resume
 *   node scripts/boot-step-by-step.mjs --reset  # Reset and start fresh
 *   node scripts/boot-step-by-step.mjs --status # Show current checkpoint status
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { initLog, log, logError, logStep } from './dev-logger.mjs';
import { initBootLog, logBootStep, logBootError, closeBootLog, getBootLogsDir } from './boot-logger.mjs';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const CHECKPOINT_FILE = join(REPO_ROOT, '.boot-checkpoint.json');
const BOOT_LOG_FILE = join(REPO_ROOT, '.boot-step-by-step.log');

/**
 * Boot steps in order
 */
const BOOT_STEPS = [
  {
    id: 'check-env',
    name: 'Check Environment',
    description: 'Verify Node.js, pnpm, and dependencies',
    command: async () => {
      logStep('CHECK-ENV', 'Verifying environment');
      
      // Check Node.js version
      const { stdout: nodeVersion } = await execAsync('node --version');
      log(`Node.js version: ${nodeVersion.trim()}`);
      
      // Check pnpm version
      const { stdout: pnpmVersion } = await execAsync('pnpm --version');
      log(`pnpm version: ${pnpmVersion.trim()}`);
      
      // Check if node_modules exists
      const nodeModulesExists = existsSync(join(REPO_ROOT, 'node_modules'));
      if (!nodeModulesExists) {
        throw new Error('node_modules not found - run pnpm install first');
      }
      log('node_modules found');
      
      return { success: true, message: 'Environment check passed' };
    }
  },
  {
    id: 'check-status',
    name: 'Check Current Status',
    description: 'See what apps are currently running',
    command: async () => {
      logStep('CHECK-STATUS', 'Checking current app status');
      const { stdout } = await execAsync('node scripts/dev-manager.mjs status');
      log('Current status:\n' + stdout);
      return { success: true, message: 'Status check complete' };
    }
  },
  {
    id: 'stop-existing',
    name: 'Stop Existing Servers',
    description: 'Stop any running dev servers to start fresh',
    command: async () => {
      logStep('STOP-EXISTING', 'Stopping any running servers');
      try {
        const { stdout } = await execAsync('node scripts/dev-manager.mjs stop');
        log('Stop command output:\n' + stdout);
      } catch (error) {
        // It's okay if nothing is running
        log('No servers to stop (or already stopped)');
      }
      
      // Wait a moment for ports to free up
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, message: 'Existing servers stopped' };
    }
  },
  {
    id: 'start-web',
    name: 'Start Web App',
    description: 'Start the main web app on port 3000',
    command: async () => {
      logStep('START-WEB', 'Starting web app');
      const { stdout } = await execAsync('node scripts/dev-manager.mjs start web --skip-build');
      log('Start web output:\n' + stdout);
      
      // Verify it's running
      await new Promise(resolve => setTimeout(resolve, 3000));
      const { stdout: status } = await execAsync('node scripts/dev-manager.mjs status');
      log('Status after web start:\n' + status);
      
      return { success: true, message: 'Web app started' };
    }
  },
  {
    id: 'verify-web',
    name: 'Verify Web App',
    description: 'Verify web app is responding on http://localhost:3000',
    command: async () => {
      logStep('VERIFY-WEB', 'Verifying web app is responding');
      
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        try {
          const { stdout } = await execAsync(
            `curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:3000 2>/dev/null || echo "000"`,
            { timeout: 3000 }
          );
          const statusCode = parseInt(stdout.trim(), 10);
          
          if (statusCode > 0 && statusCode < 500) {
            log(`Web app verified: HTTP ${statusCode}`);
            return { success: true, message: `Web app responding (HTTP ${statusCode})` };
          }
          
          log(`Attempt ${attempts}/${maxAttempts}: Web app not ready (HTTP ${statusCode}), waiting...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          log(`Attempt ${attempts}/${maxAttempts}: Error checking web app: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      throw new Error('Web app did not respond after 20 seconds');
    }
  },
  {
    id: 'start-docs',
    name: 'Start Docs App',
    description: 'Start the docs app on port 3001',
    command: async () => {
      logStep('START-DOCS', 'Starting docs app');
      const { stdout } = await execAsync('node scripts/dev-manager.mjs start docs --skip-build');
      log('Start docs output:\n' + stdout);
      
      // Verify it's running
      await new Promise(resolve => setTimeout(resolve, 3000));
      const { stdout: status } = await execAsync('node scripts/dev-manager.mjs status');
      log('Status after docs start:\n' + status);
      
      return { success: true, message: 'Docs app started' };
    }
  },
  {
    id: 'verify-docs',
    name: 'Verify Docs App',
    description: 'Verify docs app is responding on http://localhost:3001',
    command: async () => {
      logStep('VERIFY-DOCS', 'Verifying docs app is responding');
      
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        try {
          const { stdout } = await execAsync(
            `curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:3001 2>/dev/null || echo "000"`,
            { timeout: 3000 }
          );
          const statusCode = parseInt(stdout.trim(), 10);
          
          if (statusCode > 0 && statusCode < 500) {
            log(`Docs app verified: HTTP ${statusCode}`);
            return { success: true, message: `Docs app responding (HTTP ${statusCode})` };
          }
          
          log(`Attempt ${attempts}/${maxAttempts}: Docs app not ready (HTTP ${statusCode}), waiting...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          log(`Attempt ${attempts}/${maxAttempts}: Error checking docs app: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      throw new Error('Docs app did not respond after 20 seconds');
    }
  },
  {
    id: 'final-status',
    name: 'Final Status Check',
    description: 'Show final status of all apps',
    command: async () => {
      logStep('FINAL-STATUS', 'Final status check');
      const { stdout } = await execAsync('node scripts/dev-manager.mjs status');
      log('Final status:\n' + stdout);
      console.log('\n' + stdout);
      return { success: true, message: 'Boot complete' };
    }
  }
];

/**
 * Load checkpoint
 */
async function loadCheckpoint() {
  try {
    if (existsSync(CHECKPOINT_FILE)) {
      const content = await readFile(CHECKPOINT_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    logError('Failed to load checkpoint', error);
  }
  return { currentStep: 0, completedSteps: [], startTime: new Date().toISOString() };
}

/**
 * Save checkpoint
 */
async function saveCheckpoint(checkpoint) {
  try {
    checkpoint.lastUpdate = new Date().toISOString();
    await writeFile(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf-8');
    log(`Checkpoint saved: step ${checkpoint.currentStep}/${BOOT_STEPS.length}`);
  } catch (error) {
    logError('Failed to save checkpoint', error);
  }
}

/**
 * Reset checkpoint
 */
async function resetCheckpoint() {
  try {
    if (existsSync(CHECKPOINT_FILE)) {
      await execAsync(`rm ${CHECKPOINT_FILE}`);
      log('Checkpoint reset');
    }
  } catch (error) {
    logError('Failed to reset checkpoint', error);
  }
}

/**
 * Show checkpoint status
 */
async function showStatus() {
  const checkpoint = await loadCheckpoint();
  
  console.log('\n📋 Boot Checkpoint Status\n');
  console.log(`Current Step: ${checkpoint.currentStep}/${BOOT_STEPS.length}`);
  console.log(`Start Time: ${checkpoint.startTime || 'N/A'}`);
  console.log(`Last Update: ${checkpoint.lastUpdate || 'N/A'}`);
  console.log(`\nCompleted Steps (${checkpoint.completedSteps?.length || 0}):`);
  
  if (checkpoint.completedSteps && checkpoint.completedSteps.length > 0) {
    checkpoint.completedSteps.forEach(stepId => {
      const step = BOOT_STEPS.find(s => s.id === stepId);
      if (step) {
        console.log(`  ✅ ${step.name}`);
      }
    });
  }
  
  if (checkpoint.currentStep < BOOT_STEPS.length) {
    const nextStep = BOOT_STEPS[checkpoint.currentStep];
    console.log(`\nNext Step: ${nextStep.name}`);
    console.log(`  ${nextStep.description}`);
  } else {
    console.log('\n✅ All steps completed!');
  }
  
  console.log('');
}

/**
 * Main boot process
 */
async function boot() {
  // Initialize logging
  initLog();
  log('=== Boot Step-by-Step Started ===');
  
  // Initialize boot logger (creates numbered log files)
  const sessionId = await initBootLog();
  const logsDir = getBootLogsDir();
  console.log(`\n📝 Boot logs: ${logsDir}`);
  console.log(`   Session: ${sessionId}\n`);
  
  await logBootStep('boot-start', 'Boot process started', {
    sessionId,
    logsDirectory: logsDir,
  });
  
  const checkpoint = await loadCheckpoint();
  const startFrom = checkpoint.currentStep || 0;
  
  await logBootStep('checkpoint-load', 'Loaded checkpoint', {
    currentStep: startFrom,
    completedSteps: checkpoint.completedSteps || [],
  });
  
  console.log('\n🚀 IdeaI Monorepo - Step-by-Step Boot\n');
  console.log(`Starting from step ${startFrom + 1}/${BOOT_STEPS.length}`);
  if (startFrom > 0) {
    console.log(`(Resuming from checkpoint)\n`);
  }
  
  for (let i = startFrom; i < BOOT_STEPS.length; i++) {
    const step = BOOT_STEPS[i];
    const stepNum = i + 1;
    
    console.log(`\n[${stepNum}/${BOOT_STEPS.length}] ${step.name}`);
    console.log(`   ${step.description}`);
    console.log('');
    
    logStep(`BOOT-STEP-${stepNum}`, `${step.name} - ${step.description}`);
    
    // Log step start to boot logger
    await logBootStep(`step-${stepNum}-start`, `Starting step ${stepNum}: ${step.name}`, {
      stepId: step.id,
      stepNumber: stepNum,
      totalSteps: BOOT_STEPS.length,
      description: step.description,
    });
    
    try {
      const result = await step.command();
      
      // Log step completion
      await logBootStep(`step-${stepNum}-complete`, `Completed step ${stepNum}: ${step.name}`, {
        stepId: step.id,
        result: result.message,
        success: result.success,
      });
      
      // Mark step as completed
      if (!checkpoint.completedSteps) {
        checkpoint.completedSteps = [];
      }
      if (!checkpoint.completedSteps.includes(step.id)) {
        checkpoint.completedSteps.push(step.id);
      }
      checkpoint.currentStep = i + 1;
      
      await saveCheckpoint(checkpoint);
      
      console.log(`✅ Step ${stepNum} completed: ${result.message}`);
      log(`Step ${stepNum} completed: ${result.message}`);
      
      // Small delay between steps
      if (i < BOOT_STEPS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      // Log error to boot logger
      await logBootError(`step-${stepNum}`, error, {
        stepId: step.id,
        stepNumber: stepNum,
        stepName: step.name,
      });
      
      logError(`Step ${stepNum} failed`, error);
      console.error(`\n❌ Step ${stepNum} failed: ${error.message}`);
      console.error(`\nCheckpoint saved at step ${stepNum}.`);
      console.error(`Run again to resume from this step.\n`);
      console.error(`Check .boot-logs/ folder for detailed step logs.\n`);
      console.error(`Check .dev-manager.log for operation logs.\n`);
      
      await closeBootLog();
      process.exit(1);
    }
  }
  
  // Boot complete
  console.log('\n✅ Boot Complete!\n');
  log('=== Boot Step-by-Step Completed ===');
  
  // Show final status
  await BOOT_STEPS[BOOT_STEPS.length - 1].command();
  
  // Clear checkpoint on success
  await resetCheckpoint();
  
  await logBootStep('boot-complete', 'Boot process completed successfully', {
    totalSteps: BOOT_STEPS.length,
  });
  
  await closeBootLog();
  
  console.log('\n🎉 All apps are running!\n');
  console.log(`📝 Boot logs saved in: ${logsDir}\n`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--reset')) {
    await resetCheckpoint();
    console.log('Checkpoint reset. Starting fresh...\n');
    await boot();
  } else if (args.includes('--status')) {
    await showStatus();
  } else {
    await boot();
  }
}

main().catch((error) => {
  logError('Fatal error in boot script', error);
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});

