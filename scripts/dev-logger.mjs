#!/usr/bin/env node

/**
 * @fileoverview Dev Manager Logger - Tracks all dev server operations
 * 
 * @description
 * Logs all operations to a file for debugging crashes.
 * Each operation is logged immediately (no buffering) so we can see
 * what happened even if the process crashes.
 */

import { writeFileSync, appendFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const LOG_FILE = join(REPO_ROOT, '.dev-manager.log');

/**
 * Initialize log file
 */
export function initLog() {
  const timestamp = new Date().toISOString();
  writeFileSync(LOG_FILE, `=== Dev Manager Log Started: ${timestamp} ===\n\n`, 'utf-8');
}

/**
 * Log a message with timestamp
 */
export function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;
  
  try {
    // Write to file first (most important)
    appendFileSync(LOG_FILE, logEntry, 'utf-8');
  } catch (error) {
    // If we can't write to file, that's a problem but don't crash
    // Try to write error to stderr if possible
    try {
      process.stderr.write(`[LOG ERROR] Failed to write log: ${error.message}\n`);
    } catch {}
  }
  
  // Try to output to console, but don't fail if it's closed
  try {
    console.log(`[LOG] ${message}`);
  } catch (error) {
    // EPIPE or other write errors - ignore, file logging is more important
  }
}

/**
 * Log an error
 */
export function logError(message, error) {
  log(`${message}: ${error?.message || error}`, 'ERROR');
  if (error?.stack) {
    appendFileSync(LOG_FILE, `  Stack: ${error.stack}\n`, 'utf-8');
  }
}

/**
 * Log a step in a process
 */
export function logStep(step, details = '') {
  log(`STEP: ${step}${details ? ` - ${details}` : ''}`, 'STEP');
}

/**
 * Log command execution
 */
export function logCommand(command, args = []) {
  log(`COMMAND: ${command} ${args.join(' ')}`, 'COMMAND');
}

/**
 * Log app operation
 */
export function logAppOperation(operation, appId, details = '') {
  log(`APP ${operation.toUpperCase()}: ${appId}${details ? ` - ${details}` : ''}`, 'APP');
}

