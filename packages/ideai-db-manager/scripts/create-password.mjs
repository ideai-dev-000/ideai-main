#!/usr/bin/env node

/**
 * @fileoverview Script to create super admin password
 * 
 * This script generates a secure password and hash for super admin access.
 * Run this once to set up super admin authentication.
 */

import { createHash, randomBytes } from "crypto";

function generatePassword(length = 32) {
  const bytes = randomBytes(length);
  return bytes.toString("base64url");
}

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

const password = generatePassword();
const hash = hashPassword(password);

console.log("\n" + "=".repeat(60));
console.log("IdeaI DB Manager Password Created");
console.log("=".repeat(60) + "\n");

console.log("Password:", password);
console.log("Hash:", hash);

console.log("\n" + "-".repeat(60));
console.log("⚠️  IMPORTANT: Store this password securely!");
console.log("-".repeat(60) + "\n");

console.log("1. Add to your .env.local file:");
console.log(`   SUPER_ADMIN_PASSWORD_HASH=${hash}`);
console.log(`   NEXT_PUBLIC_SUPER_ADMIN_PASSWORD_HASH=${hash}`);
console.log("\n2. Store the plain password in a secure password manager");
console.log("   (DO NOT commit the plain password to git)");
console.log("\n3. Use this password to access the super admin panel at:");
console.log("   http://localhost:3000/super-admin");
console.log("\n4. The password hash is safe to commit (it's a one-way hash)");
console.log("\n⚠️  SECURITY: This feature is DEV-ONLY and will NOT work in production.\n");

