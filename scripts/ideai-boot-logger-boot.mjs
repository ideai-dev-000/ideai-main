#!/usr/bin/env node
/**
 * @fileoverview Boot session logging
 * 
 * @category boot
 * @description
 * Boot session logging - Creates numbered log files for each boot step
 * 
 * @module bootlogger
 * @location scripts/ideai-boot-logger-boot.mjs
 */

import { writeFile, appendFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");
const BOOT_LOGS_DIR = join(REPO_ROOT, '.boot-logs');

let currentSessionId = null;
let currentLogFile = null;
let stepCounter = 0;

/**
 * Initialize boot log directory and create session
 */
export async function initBootLog() {
  if (!existsSync(BOOT_LOGS_DIR)) {
    await mkdir(BOOT_LOGS_DIR, { recursive: true });
  }
  
  // Get next session number
  const existingSessions = existsSync(BOOT_LOGS_DIR) 
    ? await readdir(BOOT_LOGS_DIR).catch(() => [])
    : [];
  const sessionNumbers = existingSessions
    .filter(f => f.startsWith('boot-') && f.endsWith('.log'))
    .map(f => parseInt(f.replace('boot-', '').replace('.log', ''), 10))
    .filter(n => !isNaN(n));
  
  const nextSession = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) + 1 : 1;
  currentSessionId = `boot-${nextSession}`;
  currentLogFile = join(BOOT_LOGS_DIR, `${currentSessionId}.log`);
  stepCounter = 0;
  
  const timestamp = new Date().toISOString();
  await writeFile(currentLogFile, `=== Boot Session ${nextSession} Started: ${timestamp} ===\n\n`, 'utf-8');
  
  return currentSessionId;
}

/**
 * Log a boot step
 */
export async function logBootStep(stepId, message, data = {}) {
  if (!currentLogFile) {
    await initBootLog();
  }
  
  stepCounter++;
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [STEP ${stepCounter}] ${stepId}: ${message}\n`;
  
  if (Object.keys(data).length > 0) {
    const dataStr = JSON.stringify(data, null, 2);
    await appendFile(currentLogFile, logEntry + `  Data: ${dataStr}\n`, 'utf-8');
  } else {
    await appendFile(currentLogFile, logEntry, 'utf-8');
  }
}

/**
 * Log a boot error
 */
export async function logBootError(stepId, error, data = {}) {
  if (!currentLogFile) {
    await initBootLog();
  }
  
  stepCounter++;
  const timestamp = new Date().toISOString();
  const errorMessage = error?.message || String(error);
  const errorStack = error?.stack || '';
  
  const logEntry = `[${timestamp}] [ERROR] ${stepId}: ${errorMessage}\n`;
  await appendFile(currentLogFile, logEntry, 'utf-8');
  
  if (errorStack) {
    await appendFile(currentLogFile, `  Stack: ${errorStack}\n`, 'utf-8');
  }
  
  if (Object.keys(data).length > 0) {
    const dataStr = JSON.stringify(data, null, 2);
    await appendFile(currentLogFile, `  Context: ${dataStr}\n`, 'utf-8');
  }
}

/**
 * Close boot log session
 */
export async function closeBootLog() {
  if (!currentLogFile) return;
  
  const timestamp = new Date().toISOString();
  await appendFile(currentLogFile, `\n=== Boot Session Ended: ${timestamp} ===\n`, 'utf-8');
  
  currentLogFile = null;
  currentSessionId = null;
  stepCounter = 0;
}

/**
 * Get boot logs directory path
 */
export function getBootLogsDir() {
  return BOOT_LOGS_DIR;
}
