#!/usr/bin/env node
/**
 * @fileoverview V0 → IdeaI Sync - Automagical component sync from v0
 * 
 * @module IdeAIV0Sync
 * @description
 * Syncs compatible components, modules, and blocks from apps/v0-ideai/ to apps/web/.
 * Applies IdeaI alignment automatically and handles conflicts.
 * 
 * Usage:
 *   node scripts/ideai-v0-sync.mjs [--preview] [--watch] [--force]
 * 
 * Options:
 *   --preview    Show what would sync without actually syncing
 *   --watch      Watch for changes and sync automatically
 *   --force      Force overwrite existing files
 * 
 * @example
 * ```bash
 * # Preview what would sync
 * node scripts/ideai-v0-sync.mjs --preview
 * 
 * # Sync compatible files
 * node scripts/ideai-v0-sync.mjs
 * 
 * # Watch for changes
 * node scripts/ideai-v0-sync.mjs --watch
 * ```
 */

import { execSync } from "child_process";
import { existsSync, readdirSync, statSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join, dirname, relative, basename, extname } from "path";
import { fileURLToPath } from "url";
import { watch } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");

const V0_SOURCE = join(REPO_ROOT, "apps/v0-ideai");
const WEB_DEST = join(REPO_ROOT, "apps/web");
const V0_STAGING = join(WEB_DEST, "components/v0-staging");

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
 * Check if file should be synced
 */
function shouldSync(filePath, relativePath) {
  // Skip node_modules, .next, build artifacts
  if (relativePath.includes("node_modules") || 
      relativePath.includes(".next") ||
      relativePath.includes(".git") ||
      relativePath.includes("package-lock.json") ||
      relativePath.includes("pnpm-lock.yaml")) {
    return false;
  }

  // Only sync compatible file types
  const ext = extname(filePath);
  const syncExtensions = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
  
  if (!syncExtensions.includes(ext)) {
    return false;
  }

  // Skip config files (unless explicitly allowed)
  const configFiles = [
    "package.json", 
    "tsconfig.json", 
    "next.config.js", 
    "next.config.mjs",
    "tailwind.config.ts",
    "postcss.config.mjs",
    "eslint.config.js",
    ".ideai.json",
    "next-env.d.ts",
    "README.md"
  ];
  if (configFiles.includes(basename(filePath))) {
    return false; // Config files handled separately
  }

  // Sync all relevant directories (like-for-like structure)
  const syncDirs = ["components", "app", "lib", "hooks", "blocks", "pages"];
  const hasSyncDir = syncDirs.some(dir => relativePath.includes(`/${dir}/`) || relativePath.startsWith(`${dir}/`));
  
  // Allow app/ files and all component-related files
  if (!hasSyncDir && !relativePath.startsWith("app/")) {
    return false; // Only sync from components/, app/, lib/, hooks/, blocks/, pages/
  }

  return true;
}

/**
 * Convert file name to IdeaI kebab-case standard
 */
function toIdeAIFileName(fileName) {
  // Remove extension
  const ext = extname(fileName);
  const base = basename(fileName, ext);
  
  // Convert PascalCase or camelCase to kebab-case
  const kebab = base
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  
  return `${kebab}${ext}`;
}

/**
 * Apply IdeaI alignment to file content (Full Auto - Scalable)
 */
function applyIdeAIAlignment(content, filePath, fileName) {
  let aligned = content;
  const fileBase = basename(fileName, extname(fileName));
  const fileExt = extname(fileName);
  const isTSX = fileExt === ".tsx" || fileExt === ".ts";
  const isComponent = isTSX && (fileBase[0] === fileBase[0].toUpperCase() || fileBase.includes("component"));

  // 1. Update imports to use @/components/ui/* for shadcn components
  aligned = aligned.replace(
    /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g,
    "from '@/components/ui/$1'"
  );

  // 2. Ensure @repo/ui imports for shared components
  aligned = aligned.replace(
    /from\s+['"]@repo\/ui\/components\/([^'"]+)['"]/g,
    "from '@repo/ui/components/$1'"
  );

  // 3. Update relative imports to use @/ alias (if in trials, adjust paths)
  aligned = aligned.replace(
    /from\s+['"]\.\.\/\.\.\/components\/([^'"]+)['"]/g,
    "from '@/components/$1'"
  );
  aligned = aligned.replace(
    /from\s+['"]\.\.\/components\/([^'"]+)['"]/g,
    "from '@/components/$1'"
  );

  // 4. Replace brand references (comprehensive)
  aligned = aligned.replace(/\bIDEAI\b/g, "IdeaI");
  aligned = aligned.replace(/\bIdeai\b/g, "IdeaI");
  aligned = aligned.replace(/\bideai\b(?!-)/g, "IdeaI");
  aligned = aligned.replace(/\bIDEA\s*I\b/gi, "IdeaI");
  aligned = aligned.replace(/\bIdea\s*I\b/g, "IdeaI");

  // 5. Fix TypeScript types (remove 'any', add proper types)
  aligned = aligned.replace(/:\s*any\b/g, ": unknown");
  aligned = aligned.replace(/:\s*any\[\]/g, ": unknown[]");
  
  // 6. Ensure React imports are correct
  if (isTSX && aligned.includes("React") && !aligned.includes("import") && !aligned.includes("from 'react'")) {
    // Add React import if component uses React but no import
    if (aligned.match(/\b(useState|useEffect|useCallback|useMemo|forwardRef|React\.)/)) {
      aligned = "import * as React from 'react';\n\n" + aligned;
    }
  }

  // 7. Add comprehensive code header (for .tsx/.ts files)
  if (isTSX && !aligned.includes("@fileoverview")) {
    const moduleName = fileBase
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    
    const description = isComponent 
      ? `Component auto-synced from v0. Ready for review and promotion to production.`
      : `File auto-synced from v0. Ready for review and promotion to production.`;

    const header = `/**
 * @fileoverview ${moduleName}
 * 
 * @file ${fileName}
 * @module ${moduleName}
 * @description
 * ${description}
 * 
 * @see {@link ../../v0-ideai/${relative(V0_SOURCE, filePath)}}
 * @since ${new Date().toISOString().split("T")[0]}
 * @version 0.1.0
 * 
 * @todo Review and apply IdeaI standards
 * @todo Test functionality
 * @todo Promote to production when ready
 */

`;
    aligned = header + aligned;
  }

  // 8. Ensure proper file naming in exports (kebab-case)
  const exportName = fileBase
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  
  // Update default exports to match file name pattern
  if (aligned.includes("export default")) {
    aligned = aligned.replace(
      /export\s+default\s+function\s+(\w+)/,
      (match, name) => {
        const kebabName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        return `export default function ${kebabName}`;
      }
    );
  }

  // 9. Fix common v0 patterns
  // Remove console.logs (optional - can be configurable)
  // aligned = aligned.replace(/console\.(log|warn|error)\([^)]*\);?\n?/g, "");
  
  // 10. Ensure proper spacing and formatting
  aligned = aligned.replace(/\n{3,}/g, "\n\n"); // Max 2 newlines

  return aligned;
}

/**
 * Determine destination path for a file (v0-staging - like-for-like structure)
 * 
 * Mirrors apps/v0-ideai/ structure exactly in apps/web/components/v0-staging/
 * This allows v0 to edit directly in staging area with identical paths
 */
function getDestinationPath(sourcePath, relativePath) {
  // Mirror the exact structure from v0-ideai to v0-staging
  // apps/v0-ideai/components/ui/button.tsx → apps/web/components/v0-staging/components/ui/button.tsx
  // apps/v0-ideai/app/page.tsx → apps/web/components/v0-staging/app/page.tsx
  
  // Keep exact same structure, just change base path
  return join(V0_STAGING, relativePath);
}

/**
 * Scan directory for files to sync
 */
function scanDirectory(dir, baseDir = dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, baseDir, files);
    } else if (entry.isFile() && shouldSync(fullPath, relativePath)) {
      files.push({
        source: fullPath,
        relative: relativePath,
        dest: getDestinationPath(fullPath, relativePath),
      });
    }
  }

  return files;
}

/**
 * Sync a single file
 */
function syncFile(fileInfo, options = {}) {
  const { source, dest, relative: relPath } = fileInfo;
  const { preview = false, force = false } = options;

  // Check if destination exists
  const destExists = existsSync(dest);
  
  if (destExists && !force && !preview) {
    warn(`Skipping ${relPath} (exists, use --force to overwrite)`);
    return { synced: false, reason: "exists" };
  }

  if (preview) {
    info(`Would sync: ${relPath} → ${relative(REPO_ROOT, dest)}`);
    return { synced: false, reason: "preview" };
  }

  try {
    // Read source file
    const content = readFileSync(source, "utf-8");
    
    // Apply IdeaI alignment
    const aligned = applyIdeAIAlignment(content, source, basename(source));
    
    // Ensure destination directory exists
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    // Write aligned content
    writeFileSync(dest, aligned, "utf-8");
    
    success(`Synced: ${relPath}`);
    return { synced: true, file: relPath };
  } catch (err) {
    error(`Failed to sync ${relPath}: ${err.message}`);
    return { synced: false, reason: "error", error: err.message };
  }
}

/**
 * Main sync function
 */
function sync(options = {}) {
  const { preview = false, force = false } = options;

  log("🔄 V0 → IdeaI Sync (Staging Area)", "cyan");
  log("");

  if (!existsSync(V0_SOURCE)) {
    error(`V0 source directory not found: ${V0_SOURCE}`);
    error("Create apps/v0-ideai/ and add v0-generated components there.");
    process.exit(1);
  }

  // Ensure v0-staging directory exists (mirrors v0-ideai structure)
  if (!existsSync(V0_STAGING)) {
    mkdirSync(V0_STAGING, { recursive: true });
  }

  info(`Source: ${relative(REPO_ROOT, V0_SOURCE)}`);
  info(`Destination: ${relative(REPO_ROOT, V0_STAGING)} (v0-staging - like-for-like)`);
  info(`Note: Structure mirrors v0-ideai exactly. v0 can edit directly here.`);
  info(`      Use 'pnpm v0:promote' to move approved components to production.`);
  log("");

  // Scan for files
  const files = scanDirectory(V0_SOURCE);
  
  if (files.length === 0) {
    warn("No compatible files found to sync.");
    return { synced: 0, total: 0 };
  }

  info(`Found ${files.length} file(s) to sync`);
  log("");

  // Sync files
  let synced = 0;
  const results = [];

  for (const file of files) {
    const result = syncFile(file, { preview, force });
    if (result.synced) {
      synced++;
    }
    results.push(result);
  }

  log("");
  if (preview) {
    info(`Preview: ${files.length} file(s) would be synced`);
  } else {
    success(`Synced ${synced} of ${files.length} file(s)`);
  }

  return { synced, total: files.length, results };
}

/**
 * Watch mode - monitor for changes
 */
function watchMode() {
  log("👀 Watching for changes...", "cyan");
  log("Press Ctrl+C to stop");
  log("");

  if (!existsSync(V0_SOURCE)) {
    error(`V0 source directory not found: ${V0_SOURCE}`);
    process.exit(1);
  }

  // Initial sync
  sync({ preview: false, force: false });

  // Watch directory
  watch(V0_SOURCE, { recursive: true }, (eventType, filename) => {
    if (filename && shouldSync(join(V0_SOURCE, filename), filename)) {
      log(`\n📝 Change detected: ${filename}`, "yellow");
      sync({ preview: false, force: false });
    }
  });
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  const preview = args.includes("--preview");
  const watch = args.includes("--watch");
  const force = args.includes("--force");

  if (watch) {
    watchMode();
  } else {
    sync({ preview, force });
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { sync, watchMode, applyIdeAIAlignment };

