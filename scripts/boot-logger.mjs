#!/usr/bin/env node

/**
 * @fileoverview Boot Logger - Creates numbered log files for each boot step
 * 
 * @description
 * Creates individual log files for each step of the boot process.
 * Files are numbered sequentially (0001-, 0002-, etc.) for easy sorting.
 * All logs stored in .boot-logs/ folder for easy cleanup.
 * 
 * Usage:
 *   import { initBootLog, logBootStep, closeBootLog } from './boot-logger.mjs';
 * 
 *   initBootLog(); // Start new boot session
 *   logBootStep('step-name', 'Step description', { data }); // Log a step
 *   closeBootLog(); // Close current session
 */

import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const BOOT_LOGS_DIR = join(REPO_ROOT, '.boot-logs');

let stepCounter = 0;
let sessionId = null;
let sessionStartTime = null;

/**
 * Initialize boot logging session
 * Creates .boot-logs directory and starts new session
 */
export async function initBootLog() {
  try {
    // Create logs directory if it doesn't exist
    if (!existsSync(BOOT_LOGS_DIR)) {
      await mkdir(BOOT_LOGS_DIR, { recursive: true });
    }
    
    // Generate session ID (timestamp-based)
    sessionId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    sessionStartTime = Date.now();
    stepCounter = 0;
    
    // Create session info file
    const sessionInfo = {
      sessionId,
      startTime: new Date().toISOString(),
      startTimestamp: sessionStartTime,
    };
    
    await writeFile(
      join(BOOT_LOGS_DIR, `${sessionId}-session.json`),
      JSON.stringify(sessionInfo, null, 2),
      'utf-8'
    );
    
    // Log session start
    await logBootStep('session-start', 'Boot session started', sessionInfo);
    
    return sessionId;
  } catch (error) {
    console.error('Failed to initialize boot log:', error);
    return null;
  }
}

/**
 * Log a boot step to a numbered file
 * 
 * @param {string} stepName - Name/ID of the step
 * @param {string} description - Description of what this step does
 * @param {object} data - Optional data to include in log
 */
export async function logBootStep(stepName, description, data = {}) {
  if (!sessionId) {
    // Auto-initialize if not already done
    await initBootLog();
  }
  
  stepCounter++;
  const stepNumber = String(stepCounter).padStart(4, '0');
  const timestamp = new Date().toISOString();
  const elapsed = sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 1000) : 0;
  
  const logEntry = {
    stepNumber,
    stepName,
    description,
    timestamp,
    elapsedSeconds: elapsed,
    data,
  };
  
  const logFileName = `${stepNumber}-${stepName}.log`;
  const logFilePath = join(BOOT_LOGS_DIR, logFileName);
  
  const logContent = `=== Boot Step ${stepNumber}: ${stepName} ===
Timestamp: ${timestamp}
Elapsed: ${elapsed}s
Description: ${description}
${Object.keys(data).length > 0 ? `\nData:\n${JSON.stringify(data, null, 2)}` : ''}
---
`;
  
  try {
    await writeFile(logFilePath, logContent, 'utf-8');
    
    // Also append to session log
    const sessionLogPath = join(BOOT_LOGS_DIR, `${sessionId}-session.log`);
    await appendFile(sessionLogPath, logContent, 'utf-8');
    
    return logFilePath;
  } catch (error) {
    console.error(`Failed to write boot log ${logFileName}:`, error);
    return null;
  }
}

/**
 * Log an error during boot
 */
export async function logBootError(stepName, error, context = {}) {
  const errorData = {
    error: error.message,
    stack: error.stack,
    ...context,
  };
  
  return await logBootStep(`${stepName}-error`, `Error in ${stepName}`, errorData);
}

/**
 * Close boot logging session
 */
export async function closeBootLog() {
  if (!sessionId) return;
  
  const endTime = Date.now();
  const totalElapsed = Math.round((endTime - sessionStartTime) / 1000);
  
  await logBootStep('session-end', 'Boot session ended', {
    totalElapsedSeconds: totalElapsed,
    endTime: new Date().toISOString(),
  });
  
  // Update session info
  const sessionInfoPath = join(BOOT_LOGS_DIR, `${sessionId}-session.json`);
  if (existsSync(sessionInfoPath)) {
    const { readFile } = await import('fs/promises');
    const sessionInfo = JSON.parse(await readFile(sessionInfoPath, 'utf-8'));
    sessionInfo.endTime = new Date().toISOString();
    sessionInfo.endTimestamp = endTime;
    sessionInfo.totalElapsedSeconds = totalElapsed;
    await writeFile(sessionInfoPath, JSON.stringify(sessionInfo, null, 2), 'utf-8');
  }
  
  sessionId = null;
  sessionStartTime = null;
  stepCounter = 0;
}

/**
 * Get current session ID
 */
export function getSessionId() {
  return sessionId;
}

/**
 * Get boot logs directory path
 */
export function getBootLogsDir() {
  return BOOT_LOGS_DIR;
}

