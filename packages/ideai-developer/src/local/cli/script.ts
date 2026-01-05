/**
 * @fileoverview Script Runner CLI
 *
 * @module ScriptRunnerCLI
 * @description
 * CLI functions for running scripts from the package
 * Called from scripts/ideai-developer.mjs
 */

import { assertDevelopment } from "../utils/dev-check.js";
import { spawn } from "child_process";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "../../../../..");

/**
 * Run a build script
 */
export async function runBuildScript(
  script: string,
  args: string[] = [],
): Promise<void> {
  assertDevelopment();

  const scriptPath = join(REPO_ROOT, "scripts", `ideai-build-${script}.mjs`);
  return new Promise((resolve, reject) => {
    const proc = spawn("node", [scriptPath, ...args], {
      cwd: REPO_ROOT,
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });
  });
}
