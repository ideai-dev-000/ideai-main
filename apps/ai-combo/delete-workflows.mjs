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
  'weifqxtebh4430ofgurab',
  'irxwinbjsn30m3n6wwq61',
  'n7aq16r6clyv57ncitw90',
  '1s7udfxjyy1c4kxg5qu3t',
  'hv77d7fey0nvny009yjgw',
  'igasma09b7r9aiptnkcv7',
  'ehwhvlerh66addb0qg3p2',
  'oxmra0ql6xd91vgl2d5bw',
  'yzjdmicb1aag4og0x08qs',
  'm22kr7onf6wwb7qtpk7pa',
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
