#!/usr/bin/env node
/**
 * Delete workflows script
 * 
 * Deletes workflows and all related data (executions and logs) in the correct order
 * to handle foreign key constraints.
 */

import { config } from "dotenv";
import postgres from "postgres";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from script's directory
config({ path: join(__dirname, ".env.local") });
config({ path: join(__dirname, ".env") }); // Fallback to .env

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env.local or .env");
  process.exit(1);
}

const workflowIds = [
  '8k4x770zqvftjb4b6ker0', 'heto6g24j701vkcwwd7fh', 'o2km8so78pvukyd3hz2a6',
  'o8lnl8y9xg03quvhepyh7', 'odn1a7z686zp5ev1i5474', 'onrj5q3lk98x3krbd2hzw',
  'ovpp5nyyzrypnwtada854', 'px3iq5g4y4kyoe5s30efx', 'q8a5rckvokt69ie4hw7hd',
  'r4wu4nx14f4dtprtv9pzy', 'rqxzt48zhcmoig9csz9yp', 'rvwg2s5y4ovy14p1o3ubn',
  's0s884w4aty0r6di7t3c4', 's3u3ndz1l621jf6xplvrd', 'slb87d09iw6bay3t0v2mv',
  'tnlpjolchpoc2p3r9rlkr', 'u5ri5ql42k8o2n22wwsmg', 'u7qm19gitmwtqihwqkp62',
  'vtnfk1wdfnoiaezp44l0f', 'w5022r7mx4gj01h5xsidg', 'wb5pdw6qqv6joa304styz',
  'wl0h994a5sce9tijao3vu', 'wx1d3cdanv9aklrjny9ma', 'x4ccjiug4hhhe845ljr2v',
  'xrcjipt9ebbtdub4dn1it', 'xrwnyxhqzkc3mo6ivg9dy', 'y97rlwn1vetbn58bd87fw',
  'yqkl3tz3njzgccmlqfxdx', 'yy8v3442n9n54j6d2kj8r', 'zdsu4lz6e8vq9kly5vmm1',
  'zj8m1dlrh3k7dmvw8hfe6'
];

async function deleteWorkflows() {
  const sql = postgres(DATABASE_URL);
  
  try {
    console.log(`🗑️  Deleting ${workflowIds.length} workflows and related data...\n`);
    
    // Step 1: Delete execution logs
    console.log("Step 1: Deleting workflow execution logs...");
    const logsResult = await sql`
      DELETE FROM workflow_execution_logs
      WHERE execution_id IN (
        SELECT id FROM workflow_executions
        WHERE workflow_id = ANY(${workflowIds}::text[])
      )
    `;
    console.log(`   ✅ Deleted ${logsResult.count || 0} execution log(s)\n`);
    
    // Step 2: Delete executions
    console.log("Step 2: Deleting workflow executions...");
    const executionsResult = await sql`
      DELETE FROM workflow_executions
      WHERE workflow_id = ANY(${workflowIds}::text[])
    `;
    console.log(`   ✅ Deleted ${executionsResult.count || 0} execution(s)\n`);
    
    // Step 3: Delete workflows
    console.log("Step 3: Deleting workflows...");
    const workflowsResult = await sql`
      DELETE FROM workflows
      WHERE id = ANY(${workflowIds}::text[])
    `;
    console.log(`   ✅ Deleted ${workflowsResult.count || 0} workflow(s)\n`);
    
    console.log("✅ Successfully deleted all workflows and related data!");
    
  } catch (error) {
    console.error("❌ Error deleting workflows:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deleteWorkflows();
}

export { deleteWorkflows };
