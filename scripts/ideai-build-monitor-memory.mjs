#!/usr/bin/env node
/**
 * @fileoverview Memory Monitor Module - Prevents crashes by monitoring memory
 * 
 * @module MemoryMonitor
 * @description
 * Monitors Cursor and process memory to prevent 70GB memory leaks.
 * Integrated into build UI for real-time monitoring.
 * 
 * @location scripts/ideai-build-monitor-memory.mjs
 * 
 * @example
 * import { getMemorySnapshot, startMemoryMonitor } from './ideai-build-monitor-memory.mjs';
 * const snapshot = await getMemorySnapshot();
 * await startMemoryMonitor([pid1, pid2], { onAlert: (data) => console.log(data) });
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
const REPO_ROOT = join(__dirname, "..");
const MEMORY_LOG_DIR = join(REPO_ROOT, '.memory-logs');
const MEMORY_LOG_FILE = join(MEMORY_LOG_DIR, 'memory-usage.log');
const MEMORY_ALERT_FILE = join(MEMORY_LOG_DIR, 'memory-alerts.log');

// CRITICAL: Memory limits to prevent crashes
export const MEMORY_LIMITS = {
  MAX_CURSOR_MEMORY_GB: 8, // 8GB max for Cursor (was hitting 70GB!)
  MAX_PROCESS_MEMORY_MB: 2048, // 2GB max per dev process
  MAX_TOTAL_MEMORY_GB: 16, // 16GB total system memory warning
  CHECK_INTERVAL_MS: 3000, // Check every 3 seconds (faster for UI)
  ALERT_THRESHOLD_GB: 4, // Alert if Cursor exceeds 4GB
};

/**
 * Get Cursor process memory usage in GB
 */
export async function getCursorMemory() {
  try {
    const { stdout } = await execAsync(
      `ps aux | grep -i cursor | grep -v grep | awk '{sum+=$6} END {print sum/1024/1024}' || echo "0"`,
      { timeout: 2000 }
    );
    const memoryGB = parseFloat(stdout.trim()) || 0;
    return Math.round(memoryGB * 100) / 100;
  } catch {
    return 0;
  }
}

/**
 * Get total system memory usage in GB
 */
export async function getSystemMemory() {
  try {
    const { stdout } = await execAsync(
      `vm_stat | grep "Pages active" | awk '{print $3}' | sed 's/\\.//'`,
      { timeout: 2000 }
    );
    const pages = parseInt(stdout.trim(), 10) || 0;
    const memoryGB = (pages * 4096) / 1024 / 1024 / 1024;
    return Math.round(memoryGB * 100) / 100;
  } catch {
    return 0;
  }
}

/**
 * Get process memory by PID in MB
 */
export async function getProcessMemoryMB(pid) {
  if (!pid) return null;
  try {
    const { stdout } = await execAsync(
      `ps -o rss= -p ${pid} 2>/dev/null || echo "0"`,
      { timeout: 2000 }
    );
    const rssKB = parseInt(stdout.trim(), 10);
    if (isNaN(rssKB) || rssKB === 0) return null;
    return Math.round(rssKB / 1024);
  } catch {
    return null;
  }
}

/**
 * Get current memory snapshot
 */
export async function getMemorySnapshot(processPids = []) {
  const cursorGB = await getCursorMemory();
  const systemGB = await getSystemMemory();
  const processes = [];
  
  for (const pid of processPids) {
    const memoryMB = await getProcessMemoryMB(pid);
    if (memoryMB !== null) {
      processes.push({ pid, memoryMB });
    }
  }
  
  return {
    cursorGB,
    systemGB,
    processes,
    timestamp: new Date().toISOString(),
    cursorExceeded: cursorGB > MEMORY_LIMITS.MAX_CURSOR_MEMORY_GB,
    cursorWarning: cursorGB > MEMORY_LIMITS.ALERT_THRESHOLD_GB,
  };
}

/**
 * Check memory and bail if too high
 */
export async function checkMemoryAndBail() {
  const cursorGB = await getCursorMemory();
  if (cursorGB > MEMORY_LIMITS.MAX_CURSOR_MEMORY_GB) {
    throw new Error(`Cursor memory ${cursorGB}GB exceeds limit ${MEMORY_LIMITS.MAX_CURSOR_MEMORY_GB}GB - BAILING OUT`);
  }
  return cursorGB;
}

/**
 * Kill process if memory too high
 */
export async function killHighMemoryProcess(pid, memoryMB, processName) {
  if (memoryMB > MEMORY_LIMITS.MAX_PROCESS_MEMORY_MB) {
    try {
      await execAsync(`kill -9 ${pid} 2>/dev/null || true`);
      const timestamp = new Date().toISOString();
      const killLog = `[${timestamp}] KILLED: ${processName} (PID ${pid}) - Memory: ${memoryMB}MB\n`;
      
      if (!existsSync(MEMORY_LOG_DIR)) {
        await mkdir(MEMORY_LOG_DIR, { recursive: true });
      }
      await appendFile(MEMORY_ALERT_FILE, killLog, 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

/**
 * Start memory monitoring with callback
 */
export async function startMemoryMonitor(processPids = [], options = {}) {
  const { onUpdate = null, onAlert = null, duration = 0 } = options;
  const startTime = Date.now();
  let checkCount = 0;
  let monitoring = true;
  
  // Ensure log directory exists
  if (!existsSync(MEMORY_LOG_DIR)) {
    await mkdir(MEMORY_LOG_DIR, { recursive: true });
  }
  
  while (monitoring) {
    checkCount++;
    const cursorGB = await getCursorMemory();
    const systemGB = await getSystemMemory();
    
    const processInfo = [];
    for (const pid of processPids) {
      const memoryMB = await getProcessMemoryMB(pid);
      if (memoryMB !== null) {
        processInfo.push({ pid, memoryMB });
        await killHighMemoryProcess(pid, memoryMB, `Process ${pid}`);
      }
    }
    
    // Check Cursor memory
    if (cursorGB > MEMORY_LIMITS.MAX_CURSOR_MEMORY_GB) {
      const alert = {
        cursorGB,
        systemGB,
        processes: processInfo,
        type: 'cursor_exceeded',
        timestamp: new Date().toISOString(),
      };
      
      if (onAlert) {
        onAlert(alert);
      }
      
      // Log critical alert
      try {
        const timestamp = new Date().toISOString();
        const criticalAlert = `[${timestamp}] 🚨 CRITICAL: Cursor ${cursorGB}GB > ${MEMORY_LIMITS.MAX_CURSOR_MEMORY_GB}GB\n`;
        await appendFile(MEMORY_ALERT_FILE, criticalAlert, 'utf-8');
      } catch {}
    } else if (cursorGB > MEMORY_LIMITS.ALERT_THRESHOLD_GB) {
      if (onAlert) {
        onAlert({
          cursorGB,
          systemGB,
          processes: processInfo,
          type: 'cursor_warning',
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    // Call update callback
    if (onUpdate) {
      onUpdate({
        cursorGB,
        systemGB,
        processes: processInfo,
        checkCount,
        elapsed: Date.now() - startTime,
      });
    }
    
    // Log memory usage
    try {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] Cursor: ${cursorGB}GB | System: ${systemGB}GB | Processes: ${processInfo.length}\n`;
      await appendFile(MEMORY_LOG_FILE, logEntry, 'utf-8');
    } catch {}
    
    // Check if duration exceeded
    if (duration > 0 && (Date.now() - startTime) > duration) {
      monitoring = false;
      break;
    }
    
    await new Promise(resolve => setTimeout(resolve, MEMORY_LIMITS.CHECK_INTERVAL_MS));
  }
  
  return { checkCount, duration: Date.now() - startTime };
}


