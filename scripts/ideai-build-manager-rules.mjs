#!/usr/bin/env node
/**
 * @fileoverview Rules Manager Module - Centralized rules management with human-in-the-loop
 * 
 * @module RulesManager
 * @description
 * Manages development rules for IdeaI. Allows devs to propose new rules,
 * which are reviewed and then automatically synced to .cursorrules and .ideai-rules.md.
 * 
 * CRITICAL: Human-in-the-loop approval required before rules are applied.
 * @location scripts/ideai-build-manager-rules.mjs
 * 
 * @example
 * import { proposeRule, approveRule, syncRules } from './ideai-build-manager-rules.mjs';
 * 
 * // Propose a new rule
 * await proposeRule({
 *   title: "Use TypeScript strict mode",
 *   category: "code",
 *   content: "All TypeScript files must use strict mode",
 *   rationale: "Prevents common bugs"
 * });
 * 
 * // Approve a proposed rule (human review)
 * await approveRule('rule-id-123');
 * 
 * // Sync approved rules to .cursorrules and .ideai-rules.md
 * await syncRules();
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, "..");
const RULES_DIR = join(REPO_ROOT, '.ideai-rules-pending');
const CURSOR_RULES_FILE = join(REPO_ROOT, '.cursorrules');
const IDEAI_RULES_FILE = join(REPO_ROOT, '.ideai-rules.md');

/**
 * Ensure rules directory exists
 */
function ensureRulesDir() {
  if (!existsSync(RULES_DIR)) {
    mkdirSync(RULES_DIR, { recursive: true });
  }
}

/**
 * Propose a new rule
 */
export async function proposeRule(rule) {
  ensureRulesDir();
  
  const ruleId = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const ruleFile = join(RULES_DIR, `${ruleId}.json`);
  
  const ruleData = {
    id: ruleId,
    status: 'pending',
    proposedAt: new Date().toISOString(),
    proposedBy: process.env.USER || 'unknown',
    title: rule.title,
    category: rule.category || 'general', // code, docs, commit, ui, etc.
    content: rule.content,
    rationale: rule.rationale || '',
    examples: rule.examples || [],
    priority: rule.priority || 'medium', // low, medium, high, critical
  };
  
  writeFileSync(ruleFile, JSON.stringify(ruleData, null, 2), 'utf-8');
  
  return {
    id: ruleId,
    message: `Rule proposed: ${rule.title}`,
    file: ruleFile,
  };
}

/**
 * List all pending rules
 */
export function listPendingRules() {
  ensureRulesDir();
  
  if (!existsSync(RULES_DIR)) {
    return [];
  }
  
  const files = readdirSync(RULES_DIR).filter(f => f.endsWith('.json'));
  const rules = [];
  
  for (const file of files) {
    try {
      const content = readFileSync(join(RULES_DIR, file), 'utf-8');
      const rule = JSON.parse(content);
      if (rule.status === 'pending') {
        rules.push(rule);
      }
    } catch (e) {
      // Skip invalid files
    }
  }
  
  return rules.sort((a, b) => new Date(b.proposedAt) - new Date(a.proposedAt));
}

/**
 * Approve a rule (human-in-the-loop)
 */
export async function approveRule(ruleId, options = {}) {
  ensureRulesDir();
  
  const ruleFile = join(RULES_DIR, `${ruleId}.json`);
  if (!existsSync(ruleFile)) {
    throw new Error(`Rule not found: ${ruleId}`);
  }
  
  const rule = JSON.parse(readFileSync(ruleFile, 'utf-8'));
  
  if (rule.status !== 'pending') {
    throw new Error(`Rule ${ruleId} is not pending (status: ${rule.status})`);
  }
  
  // Update rule status
  rule.status = 'approved';
  rule.approvedAt = new Date().toISOString();
  rule.approvedBy = process.env.USER || 'unknown';
  rule.approvedNotes = options.notes || '';
  
  writeFileSync(ruleFile, JSON.stringify(rule, null, 2), 'utf-8');
  
  return {
    id: ruleId,
    message: `Rule approved: ${rule.title}`,
    rule,
  };
}

/**
 * Reject a rule
 */
export async function rejectRule(ruleId, reason = '') {
  ensureRulesDir();
  
  const ruleFile = join(RULES_DIR, `${ruleId}.json`);
  if (!existsSync(ruleFile)) {
    throw new Error(`Rule not found: ${ruleId}`);
  }
  
  const rule = JSON.parse(readFileSync(ruleFile, 'utf-8'));
  rule.status = 'rejected';
  rule.rejectedAt = new Date().toISOString();
  rule.rejectedBy = process.env.USER || 'unknown';
  rule.rejectionReason = reason;
  
  writeFileSync(ruleFile, JSON.stringify(rule, null, 2), 'utf-8');
  
  return {
    id: ruleId,
    message: `Rule rejected: ${rule.title}`,
  };
}

/**
 * Get all approved rules
 */
export function getApprovedRules() {
  ensureRulesDir();
  
  if (!existsSync(RULES_DIR)) {
    return [];
  }
  
  const files = readdirSync(RULES_DIR).filter(f => f.endsWith('.json'));
  const rules = [];
  
  for (const file of files) {
    try {
      const content = readFileSync(join(RULES_DIR, file), 'utf-8');
      const rule = JSON.parse(content);
      if (rule.status === 'approved') {
        rules.push(rule);
      }
    } catch (e) {
      // Skip invalid files
    }
  }
  
  return rules.sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt));
}

/**
 * Format rule for .cursorrules
 */
function formatRuleForCursor(rule) {
  return `
## ${rule.title}

${rule.content}

${rule.rationale ? `**Rationale**: ${rule.rationale}` : ''}

${rule.examples.length > 0 ? `**Examples**:\n${rule.examples.map(e => `- ${e}`).join('\n')}` : ''}
`;
}

/**
 * Format rule for .ideai-rules.md
 */
function formatRuleForIdeai(rule) {
  return `
### ${rule.title}

${rule.content}

${rule.rationale ? `**Rationale**: ${rule.rationale}` : ''}

${rule.examples.length > 0 ? `**Examples**:\n${rule.examples.map(e => `- ${e}`).join('\n')}` : ''}
`;
}

/**
 * Sync approved rules to .cursorrules and .ideai-rules.md
 */
export async function syncRules(options = {}) {
  const approvedRules = getApprovedRules();
  
  if (approvedRules.length === 0) {
    return {
      synced: 0,
      message: 'No approved rules to sync',
    };
  }
  
  // Read existing .cursorrules
  let cursorRulesContent = '';
  if (existsSync(CURSOR_RULES_FILE)) {
    cursorRulesContent = readFileSync(CURSOR_RULES_FILE, 'utf-8');
  }
  
  // Read existing .ideai-rules.md
  let ideaiRulesContent = '';
  if (existsSync(IDEAI_RULES_FILE)) {
    ideaiRulesContent = readFileSync(IDEAI_RULES_FILE, 'utf-8');
  }
  
  // Group rules by category
  const rulesByCategory = {};
  for (const rule of approvedRules) {
    const category = rule.category || 'general';
    if (!rulesByCategory[category]) {
      rulesByCategory[category] = [];
    }
    rulesByCategory[category].push(rule);
  }
  
  // Append to .cursorrules
  let cursorAppend = '\n\n## Auto-Synced Rules (from Rules Manager)\n\n';
  for (const [category, rules] of Object.entries(rulesByCategory)) {
    cursorAppend += `### ${category.toUpperCase()} Rules\n\n`;
    for (const rule of rules) {
      cursorAppend += formatRuleForCursor(rule);
    }
  }
  
  // Append to .ideai-rules.md
  let ideaiAppend = '\n\n## Auto-Synced Rules (from Rules Manager)\n\n';
  for (const [category, rules] of Object.entries(rulesByCategory)) {
    ideaiAppend += `### ${category.toUpperCase()} Rules\n\n`;
    for (const rule of rules) {
      ideaiAppend += formatRuleForIdeai(rule);
    }
  }
  
  // Write files
  if (!options.dryRun) {
    writeFileSync(CURSOR_RULES_FILE, cursorRulesContent + cursorAppend, 'utf-8');
    writeFileSync(IDEAI_RULES_FILE, ideaiRulesContent + ideaiAppend, 'utf-8');
  }
  
  return {
    synced: approvedRules.length,
    rules: approvedRules.map(r => r.id),
    message: `Synced ${approvedRules.length} approved rules to .cursorrules and .ideai-rules.md`,
  };
}

/**
 * Interactive rule approval (human-in-the-loop)
 */
export async function interactiveApprove() {
  const pendingRules = listPendingRules();
  
  if (pendingRules.length === 0) {
    console.log('✅ No pending rules to review');
    return;
  }
  
  console.log(`\n📋 Found ${pendingRules.length} pending rule(s) to review:\n`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));
  
  for (const rule of pendingRules) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Rule ID: ${rule.id}`);
    console.log(`Title: ${rule.title}`);
    console.log(`Category: ${rule.category}`);
    console.log(`Priority: ${rule.priority}`);
    console.log(`Proposed by: ${rule.proposedBy}`);
    console.log(`Proposed at: ${rule.proposedAt}`);
    console.log(`\nContent:\n${rule.content}`);
    if (rule.rationale) {
      console.log(`\nRationale: ${rule.rationale}`);
    }
    if (rule.examples.length > 0) {
      console.log(`\nExamples:\n${rule.examples.map(e => `  - ${e}`).join('\n')}`);
    }
    console.log(`\n${'='.repeat(60)}`);
    
    const action = await question('\nApprove (a), Reject (r), Skip (s), or Quit (q)? ');
    
    if (action.toLowerCase() === 'q') {
      break;
    } else if (action.toLowerCase() === 's') {
      continue;
    } else if (action.toLowerCase() === 'a') {
      const notes = await question('Approval notes (optional): ');
      await approveRule(rule.id, { notes });
      console.log(`✅ Approved: ${rule.title}`);
    } else if (action.toLowerCase() === 'r') {
      const reason = await question('Rejection reason: ');
      await rejectRule(rule.id, reason);
      console.log(`❌ Rejected: ${rule.title}`);
    }
  }
  
  rl.close();
  
  // Ask if user wants to sync
  const sync = await question('\nSync approved rules to .cursorrules and .ideai-rules.md? (y/n): ');
  if (sync.toLowerCase() === 'y') {
    const result = await syncRules();
    console.log(`\n✅ ${result.message}`);
  }
}


