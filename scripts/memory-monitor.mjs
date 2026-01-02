#!/usr/bin/env node

/**
 * @fileoverview Memory Monitor - Tracks Cursor and process memory to prevent crashes
 * 
 * @description
 * Monitors memory usage of Cursor and development processes.
 * Automatically kills processes if memory exceeds safe limits.
 * Logs all memory usage to prevent crashes.
 * 
 * CRITICAL: This prevents 70GB memory leaks from crashing the Mac.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const MEMORY_LOG_DIR = join(REPO_ROOT, '.memory-logs');
const MEMORY_LOG_FILE = join(MEMORY_LOG_DIR, 'memory-usage.log');
const MEMORY_ALERT_FILE = join(MEMORY_LOG_DIR, 'memory-alerts.log');

// CRITICAL: Memory limits to prevent crashes
const MAX_CURSOR_MEMORY_GB = 8; // 8GB max for Cursor (was hitting 70GB!)
const MAX_PROCESS_MEMORY_MB = 2048; // 2GB max per dev process
const MAX_TOTAL_MEMORY_GB = 16; // 16GB total system memory warning
const CHECK_INTERVAL_MS = 5000; // Check every 5 seconds
const ALERT_THRESHOLD_GB = 4; // Alert if Cursor exceeds 4GB

/**
 * Get Cursor process memory usage
 */
async function getCursorMemory() {
  try {
    // Find Cursor processes
    const { stdout } = await execAsync(
      `ps aux | grep -i cursor | grep -v grep | awk '{sum+=$6} END {print sum/1024/1024}' || echo "0"`,
      { timeout: 2000 }
    );
    const memoryGB = parseFloat(stdout.trim()) || 0;
    return Math.round(memoryGB * 100) / 100; // Round to 2 decimals
  } catch {
    return 0;
  }
}

/**
 * Get total system memory usage
 */
async function getSystemMemory() {
  try {
    const { stdout } = await execAsync(
      `vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/\\.//'`,
      { timeout: 2000 }
    );
    const pages = parseInt(stdout.trim(), 10) || 0;
    // macOS page size is 4096 bytes
    const memoryGB = (pages * 4096) / 1024 / 1024 / 1024;
    return Math.round(memoryGB * 100) / 100;
  } catch {
    return 0;
  }
}

/**
 * Get process memory by PID
 */
async function getProcessMemoryMB(pid) {
  if (!pid) return null;
  try {
    const { stdout } = await execAsync(
      `ps -o rss= -p ${pid} 2>/dev/null || echo "0"`,
      { timeout: 2000 }
    );
    const rssKB = parseInt(stdout.trim(), 10);
    if (isNaN(rssKB) || rssKB === 0) return null;
    return Math.round(rssKB / 1024); // Convert KB to MB
  } catch {
    return null;
  }
}

/**
 * Log memory usage
 */
async function logMemory(cursorGB, systemGB, processes = []) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Cursor: ${cursorGB}GB | System: ${systemGB}GB | Processes: ${processes.length}\n`;
  
  try {
    if (!existsSync(MEMORY_LOG_DIR)) {
      await mkdir(MEMORY_LOG_DIR, { recursive: true });
    }
    await appendFile(MEMORY_LOG_FILE, logEntry, 'utf-8');
  } catch (error) {
    console.error('Failed to log memory:', error);
  }
  
  // Alert if memory is high
  if (cursorGB > ALERT_THRESHOLD_GB) {
    const alertEntry = `[${timestamp}] ⚠️  ALERT: Cursor memory at ${cursorGB}GB (threshold: ${ALERT_THRESHOLD_GB}GB)\n`;
    try {
      await appendFile(MEMORY_ALERT_FILE, alertEntry, 'utf-8');
    } catch {}
  }
}

/**
 * Kill process if memory too high
 */
async function killHighMemoryProcess(pid, memoryMB, processName) {
  if (memoryMB > MAX_PROCESS_MEMORY_MB) {
    console.error(`🚨 KILLING: ${processName} (PID ${pid}) - Memory: ${memoryMB}MB > ${MAX_PROCESS_MEMORY_MB}MB`);
    try {
      await execAsync(`kill -9 ${pid} 2>/dev/null || true`);
      const timestamp = new Date().toISOString();
      const killLog = `[${timestamp}] KILLED: ${processName} (PID ${pid}) - Memory: ${memoryMB}MB\n`;
      await appendFile(MEMORY_ALERT_FILE, killLog, 'utf-8');
      return true;
    } catch (error) {
      console.error(`Failed to kill process ${pid}:`, error);
      return false;
    }
  }
  return false;
}

/**
 * Monitor memory continuously
 */
async function monitorMemory(processPids = [], options = {}) {
  const { duration = 0, onAlert = null } = options; // duration 0 = monitor indefinitely
  const startTime = Date.now();
  let checkCount = 0;
  
  console.log('🔍 Memory Monitor Started');
  console.log(`   Max Cursor: ${MAX_CURSOR_MEMORY_GB}GB`);
  console.log(`   Max Process: ${MAX_PROCESS_MEMORY_MB}MB`);
  console.log(`   Alert Threshold: ${ALERT_THRESHOLD_GB}GB`);
  console.log(`   Check Interval: ${CHECK_INTERVAL_MS}ms\n`);
  
  while (true) {
    checkCount++;
    const cursorGB = await getCursorMemory();
    const systemGB = await getSystemMemory();
    
    // Check Cursor memory
    if (cursorGB > MAX_CURSOR_MEMORY_GB) {
      const alert = `🚨 CRITICAL: Cursor memory at ${cursorGB}GB exceeds limit of ${MAX_CURSOR_MEMORY_GB}GB!`;
      console.error(alert);
      console.error('⚠️  Cursor may crash! Consider restarting Cursor.');
      
      if (onAlert) {
        onAlert({ cursorGB, systemGB, type: 'cursor_exceeded' });
      }
      
      // Log critical alert
      try {
        const timestamp = new Date().toISOString();
        const criticalAlert = `[${timestamp}] 🚨 CRITICAL: Cursor ${cursorGB}GB > ${MAX_CURSOR_MEMORY_GB}GB\n`;
        await appendFile(MEMORY_ALERT_FILE, criticalAlert, 'utf-8');
      } catch {}
    } else if (cursorGB > ALERT_THRESHOLD_GB) {
      console.warn(`⚠️  Cursor memory: ${cursorGB}GB (threshold: ${ALERT_THRESHOLD_GB}GB)`);
    }
    
    // Check process memory
    const processInfo = [];
    for (const pid of processPids) {
      const memoryMB = await getProcessMemoryMB(pid);
      if (memoryMB !== null) {
        processInfo.push({ pid, memoryMB });
        await killHighMemoryProcess(pid, memoryMB, `Process ${pid}`);
      }
    }
    
    // Log memory usage
    await logMemory(cursorGB, systemGB, processInfo);
    
    // Display status every 10 checks (50 seconds)
    if (checkCount % 10 === 0) {
      console.log(`[${checkCount * CHECK_INTERVAL_MS / 1000}s] Cursor: ${cursorGB}GB | System: ${systemGB}GB`);
    }
    
    // Check if duration exceeded
    if (duration > 0 && (Date.now() - startTime) > duration) {
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL_MS));
  }
}

/**
 * Get current memory snapshot
 */
export async function getMemorySnapshot() {
  const cursorGB = await getCursorMemory();
  const systemGB = await getSystemMemory();
  return { cursorGB, systemGB, timestamp: new Date().toISOString() };
}

/**
 * Start memory monitoring
 */
export async function startMemoryMonitor(processPids = [], options = {}) {
  return monitorMemory(processPids, options);
}

/**
 * Check memory and bail if too high
 */
export async function checkMemoryAndBail() {
  const cursorGB = await getCursorMemory();
  if (cursorGB > MAX_CURSOR_MEMORY_GB) {
    throw new Error(`Cursor memory ${cursorGB}GB exceeds limit ${MAX_CURSOR_MEMORY_GB}GB - BAILING OUT`);
  }
  return cursorGB;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const duration = args.includes('--duration') 
    ? parseInt(args[args.indexOf('--duration') + 1], 10) * 1000 
    : 0;
  
  startMemoryMonitor([], { duration }).catch(console.error);
}

