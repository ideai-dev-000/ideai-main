#!/usr/bin/env node

/**
 * @fileoverview Read all .ideai metadata files and generate index data
 * 
 * @description
 * Scans all apps for .ideai metadata files and generates a JSON index.
 * Can be used by static HTML pages or API routes.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const APPS_DIR = join(REPO_ROOT, 'apps');

/**
 * Check if a port is in use
 */
async function isPortInUse(port) {
  if (!port) return false;
  try {
    const { stdout } = await execAsync(`lsof -ti:${port} 2>/dev/null || true`);
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Read all .ideai metadata files
 */
export async function readIdeaiMetadata(includeStatus = false) {
  const entries = await readdir(APPS_DIR, { withFileTypes: true });
  const apps = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const appPath = join(APPS_DIR, entry.name);
      const ideaiJsonPath = join(appPath, '.ideai.json');
      
      try {
        let metadata = null;
        
        // Read .ideai.json (only format supported)
        const stats = await stat(ideaiJsonPath);
        if (stats.isFile()) {
          const content = await readFile(ideaiJsonPath, 'utf-8');
          const config = JSON.parse(content);
          
          // Extract metadata from config
          metadata = {
            id: config.metadata?.id || entry.name,
            name: config.name || entry.name,
            description: config.description || '',
            port: config.metadata?.port || config.localPort || null,
            css: config.metadata?.css || [],
            capabilities: config.metadata?.capabilities || [],
            path: config.metadata?.path || `/${entry.name}`,
            category: config.metadata?.category || 'development',
          };
        }
        
        if (metadata) {
          let status = null;
          if (includeStatus && metadata.port) {
            const running = await isPortInUse(metadata.port);
            status = {
              running,
              port: metadata.port,
              url: running ? `http://localhost:${metadata.port}` : null,
            };
          }
          
          apps.push({
            ...metadata,
            status,
            appPath: appPath.replace(REPO_ROOT, ''),
          });
        }
      } catch (error) {
        // Skip if files don't exist or can't be read
      }
    }
  }
  
  return apps.sort((a, b) => (a.port || 0) - (b.port || 0));
}

/**
 * CLI usage
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const includeStatus = process.argv.includes('--status');
  const apps = await readIdeaiMetadata(includeStatus);
  console.log(JSON.stringify(apps, null, 2));
}


