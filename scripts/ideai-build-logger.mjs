#!/usr/bin/env node
/**
 * @fileoverview Unified Logger Module - Centralized logging for ideai-build
 * 
 * @module Logger
 * @description
 * Provides structured logging with file output and console display.
 * Supports different log levels and structured data.
 * @location scripts/ideai-build-logger.mjs
 */

import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");
const LOG_DIR = join(REPO_ROOT, '.ideai-build-logs');
const LOG_FILE = join(LOG_DIR, 'ideai-build.log');

// Colors for console output
export const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  magenta: "\x1b[35m",
};

/**
 * Initialize log directory
 */
export function initLog() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  writeFileSync(LOG_FILE, `=== IdeaI Build Log Started: ${timestamp} ===\n\n`, 'utf-8');
}

/**
 * Log a message with level
 */
export function log(message, level = 'INFO', color = null) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;
  
  // Write to file
  try {
    appendFileSync(LOG_FILE, logEntry, 'utf-8');
  } catch (error) {
    // Silently fail if can't write
  }
  
  // Console output with color
  const colorCode = color || colors.reset;
  try {
    console.log(`${colorCode}${message}${colors.reset}`);
  } catch {}
}

/**
 * Log success message
 */
export function success(message) {
  log(`✅ ${message}`, 'SUCCESS', colors.green);
}

/**
 * Log error message
 */
export function error(message) {
  log(`❌ ${message}`, 'ERROR', colors.red);
}

/**
 * Log warning message
 */
export function warn(message) {
  log(`⚠️  ${message}`, 'WARN', colors.yellow);
}

/**
 * Log info message
 */
export function info(message) {
  log(message, 'INFO', colors.cyan);
}

/**
 * Log step message
 */
export function step(message) {
  log(`→ ${message}`, 'STEP', colors.blue);
}

/**
 * Log debug message
 */
export function debug(message, data = null) {
  if (data) {
    log(`🔍 ${message}: ${JSON.stringify(data, null, 2)}`, 'DEBUG', colors.dim);
  } else {
    log(`🔍 ${message}`, 'DEBUG', colors.dim);
  }
}

/**
 * Format memory info for display
 */
export function formatMemory(cursorGB, systemGB, processes = []) {
  const cursorStatus = cursorGB > 8 ? '🚨' : cursorGB > 4 ? '⚠️' : '✅';
  const processInfo = processes.length > 0 
    ? ` | Processes: ${processes.map(p => `${p.pid}(${p.memoryMB}MB)`).join(', ')}`
    : '';
  return `${cursorStatus} Cursor: ${cursorGB.toFixed(2)}GB | System: ${systemGB.toFixed(2)}GB${processInfo}`;
}


