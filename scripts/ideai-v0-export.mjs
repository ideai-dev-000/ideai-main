#!/usr/bin/env node
/**
 * @fileoverview V0 Auto-Export - Make v0 components immediately available in all apps
 * 
 * @module IdeAIV0Export
 * @description
 * Auto-exports components from v0-staging to shared location so they're immediately
 * available in all apps via @repo/ui imports. Enables frictionless testing across apps.
 * 
 * Usage:
 *   node scripts/ideai-v0-export.mjs [--watch] [--all]
 * 
 * Options:
 *   --watch    Watch for changes and auto-export
 *   --all      Export all components (not just new/changed)
 * 
 * How it works:
 * 1. Scans apps/web/components/v0-staging/ for components
 * 2. Exports to packages/ui/src/components/v0/ (shared location)
 * 3. Updates packages/ui/src/index.ts to export them
 * 4. All apps can immediately import: import { ComponentName } from "@repo/ui"
 * 
 * @example
 * ```bash
 * # Export all v0 components
 * pnpm v0:export
 * 
 * # Watch and auto-export on changes
 * pnpm v0:export:watch
 * ```
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, statSync } from "fs";
import { join, dirname, relative, basename, extname } from "path";
import { fileURLToPath } from "url";
import { watch } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

const V0_STAGING = join(REPO_ROOT, "apps/web/components/v0-staging");
const V0_EXPORT = join(REPO_ROOT, "packages/ui/src/components/v0");
const UI_INDEX = join(REPO_ROOT, "packages/ui/src/index.ts");

// Colors for output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function info(message) {
  log(`ℹ️  ${message}`, "blue");
}

function warn(message) {
  log(`⚠️  ${message}`, "yellow");
}

/**
 * Get component name from file
 */
function getComponentName(filePath) {
  const base = basename(filePath, extname(filePath));
  // Convert kebab-case to PascalCase
  // Handle special cases like "root-layout" -> "RootLayout"
  return base
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Fix function names in exported content
 * Converts invalid function names like "root-layout" to "RootLayout"
 */
function fixFunctionNames(content, fileName) {
  const base = basename(fileName, extname(fileName));
  const componentName = getComponentName(fileName);
  
  // Fix default export function names
  content = content.replace(
    /export\s+default\s+function\s+([a-z-]+)\s*\(/gi,
    (match, funcName) => {
      const fixedName = funcName
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
      return `export default function ${fixedName}(`;
    }
  );
  
  // Fix named export function names
  content = content.replace(
    /export\s+function\s+([a-z-]+)\s*\(/gi,
    (match, funcName) => {
      const fixedName = funcName
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
      return `export function ${fixedName}(`;
    }
  );
  
  return content;
}

/**
 * Check if file is a React component
 */
function isComponent(filePath) {
  const ext = extname(filePath);
  if (ext !== ".tsx" && ext !== ".ts") return false;
  
  const content = readFileSync(filePath, "utf-8");
  // Check for React component patterns
  return content.includes("export") && (
    content.includes("function") ||
    content.includes("const") ||
    content.includes("export default")
  );
}

/**
 * Check if a file should be exported (exclude app-specific Next.js files)
 */
function shouldExportFile(filePath) {
  const fileName = basename(filePath);
  // Exclude Next.js app-specific files (not reusable components)
  const appSpecificFiles = ["layout.tsx", "page.tsx", "loading.tsx", "error.tsx", "not-found.tsx", "template.tsx"];
  if (appSpecificFiles.includes(fileName)) {
    return false;
  }
  // Exclude config files
  const configFiles = ["globals.css", "package.json", "tsconfig.json", "next.config.js", "tailwind.config.ts"];
  if (configFiles.includes(fileName)) {
    return false;
  }
  return true;
}

/**
 * Find all components in v0-staging
 */
function findComponents(dir = V0_STAGING, baseDir = V0_STAGING, components = []) {
  if (!existsSync(dir)) {
    return components;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = relative(baseDir, fullPath);

    // Skip certain directories
    if (entry.isDirectory()) {
      if (!["node_modules", ".next", ".git"].includes(entry.name)) {
        findComponents(fullPath, baseDir, components);
      }
    } else if (entry.isFile() && isComponent(fullPath)) {
      const ext = extname(fullPath);
      if ((ext === ".tsx" || ext === ".ts") && shouldExportFile(fullPath)) {
        components.push({
          source: fullPath,
          relative: relativePath,
          name: getComponentName(fullPath),
          fileName: basename(fullPath),
        });
      }
    }
  }

  return components;
}

/**
 * Export component to shared location
 */
function exportComponent(component) {
  const { source, relative: relPath, fileName } = component;
  const destPath = join(V0_EXPORT, fileName);

  try {
    // Ensure destination directory exists
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    // Read and update imports in component
    let content = readFileSync(source, "utf-8");
    
    // Fix function names (convert kebab-case to PascalCase)
    content = fixFunctionNames(content, fileName);
    
    // Update relative imports to use @repo/ui or @/ alias
    content = content.replace(
      /from\s+['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g,
      "from '@repo/ui/components/$1'"
    );
    content = content.replace(
      /from\s+['"]\.\.\/components\/([^'"]+)['"]/g,
      "from '@repo/ui/components/$1'"
    );
    // Fix @/components/svgs imports - these should import from @repo/ui
    // Handle case-insensitive matching for IdeaI-icon -> ideai-icon
    content = content.replace(
      /from\s+['"]@\/components\/svgs\/([^'"]+)['"]/gi,
      (match, iconName) => {
        // Normalize icon name (IdeaI-icon -> ideai-icon)
        const normalized = iconName.toLowerCase().replace(/^ideai/, 'ideai');
        return `from '@repo/ui/components/v0/${normalized}'`;
      }
    );
    // Fix @/components/logos imports - these should import from @repo/ui
    content = content.replace(
      /from\s+['"]@\/components\/logos\/([^'"]+)['"]/g,
      "from '@repo/ui/components/v0/$1'"
    );
    // Fix @/components/ui imports - keep as @/ for app-specific components
    content = content.replace(
      /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g,
      "from '@/components/ui/$1'"
    );

    // Add export if missing
    if (!content.includes("export") && content.includes("function")) {
      content = content.replace(
        /^(function\s+\w+)/m,
        "export $1"
      );
    }

    // Write to export location
    writeFileSync(destPath, content, "utf-8");
    
    return { exported: true, path: destPath };
  } catch (err) {
    error(`Failed to export ${relPath}: ${err.message}`);
    return { exported: false, error: err.message };
  }
}

/**
 * Update packages/ui/src/index.ts to export v0 components
 */
function updateUIExports(components) {
  if (!existsSync(UI_INDEX)) {
    warn("packages/ui/src/index.ts not found, skipping export updates");
    return;
  }

  let content = readFileSync(UI_INDEX, "utf-8");
  
  // Remove old v0 exports
  const v0ExportRegex = /\/\/ V0 Components[\s\S]*?\/\/ End V0 Components\n/g;
  content = content.replace(v0ExportRegex, "");

  // Add new v0 exports
  if (components.length > 0) {
    const exports = components
      .map(comp => {
        const compName = comp.name;
        return `export { ${compName} } from "./components/v0/${comp.fileName.replace(/\.(tsx|ts)$/, "")}";`;
      })
      .join("\n");

    const v0Exports = `\n// V0 Components - Auto-exported from v0-staging\n// Available immediately in all apps via: import { ComponentName } from "@repo/ui"\n${exports}\n// End V0 Components\n`;

    // Insert before last export or at end
    if (content.includes("export")) {
      const lastExportIndex = content.lastIndexOf("export");
      const insertIndex = content.lastIndexOf("\n", lastExportIndex) + 1;
      content = content.slice(0, insertIndex) + v0Exports + content.slice(insertIndex);
    } else {
      content += v0Exports;
    }
  }

  writeFileSync(UI_INDEX, content, "utf-8");
}

/**
 * Export all v0 components
 */
function exportAll(forceAll = false) {
  log("📦 V0 Auto-Export - Making components available in all apps", "cyan");
  log("");

  if (!existsSync(V0_STAGING)) {
    warn(`v0-staging not found: ${relative(REPO_ROOT, V0_STAGING)}`);
    info("Run 'pnpm v0:sync' first to sync components to staging.");
    return { exported: 0, total: 0 };
  }

  // Ensure export directory exists
  if (!existsSync(V0_EXPORT)) {
    mkdirSync(V0_EXPORT, { recursive: true });
  }

  // Find all components
  const components = findComponents();
  
  if (components.length === 0) {
    warn("No components found in v0-staging.");
    info("Create components in apps/v0-ideai/ and run 'pnpm v0:sync'");
    return { exported: 0, total: 0 };
  }

  info(`Found ${components.length} component(s) in v0-staging`);
  log("");

  // Export each component
  let exported = 0;
  const exportedComponents = [];

  for (const component of components) {
    const destPath = join(V0_EXPORT, component.fileName);
    const needsExport = forceAll || !existsSync(destPath);

    if (needsExport) {
      const result = exportComponent(component);
      if (result.exported) {
        success(`Exported: ${component.relative} → ${component.name}`);
        exported++;
        exportedComponents.push(component);
      }
    } else {
      info(`Skipped: ${component.relative} (already exported)`);
    }
  }

  // Update UI exports
  if (exportedComponents.length > 0) {
    updateUIExports(exportedComponents);
    success(`Updated packages/ui/src/index.ts with ${exportedComponents.length} export(s)`);
  }

  log("");
  success(`Exported ${exported} of ${components.length} component(s)`);
  info("Components now available in all apps via: import { ComponentName } from '@repo/ui'");

  return { exported, total: components.length };
}

/**
 * Watch mode - auto-export on changes
 */
function watchMode() {
  log("👀 Watching v0-staging for changes...", "cyan");
  log("Components will auto-export and be available immediately in all apps");
  log("Press Ctrl+C to stop");
  log("");

  if (!existsSync(V0_STAGING)) {
    error(`v0-staging not found: ${relative(REPO_ROOT, V0_STAGING)}`);
    process.exit(1);
  }

  // Initial export
  exportAll(true);

  // Watch for changes
  watch(V0_STAGING, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith(".tsx") || filename.endsWith(".ts"))) {
      log(`\n📝 Change detected: ${filename}`, "yellow");
      exportAll(false); // Only export changed/new files
    }
  });
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  const watch = args.includes("--watch");
  const all = args.includes("--all");

  if (watch) {
    watchMode();
  } else {
    exportAll(all);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { exportAll, watchMode };

