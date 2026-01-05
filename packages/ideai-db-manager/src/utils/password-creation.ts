/**
 * @fileoverview Safe password creation for super admin access
 *
 * @module password-creation
 * @description
 * Utilities for safely creating and managing super admin passwords.
 * Uses secure hashing and environment variable storage.
 */

import { createHash, randomBytes } from "crypto";
import { assertSuperAdminEnabled } from "./dev-check";

/**
 * Generate a secure random password for IdeaI DB Manager
 *
 * @param length - Password length (default: 32)
 * @returns Secure random password
 */
export function generateSuperAdminPassword(length: number = 32): string {
  assertSuperAdminEnabled();

  // Generate cryptographically secure random bytes
  const bytes = randomBytes(length);
  // Convert to base64url (URL-safe base64)
  return bytes.toString("base64url");
}

/**
 * Hash a password using SHA-256
 *
 * @param password - Plain text password
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  assertSuperAdminEnabled();

  return createHash("sha256").update(password).digest("hex");
}

/**
 * Verify a password against a hash
 *
 * @param password - Plain text password to verify
 * @param hash - Stored hash to compare against
 * @returns true if password matches hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  assertSuperAdminEnabled();

  const passwordHash = hashPassword(password);
  return passwordHash === hash;
}

/**
 * Create IdeaI DB Manager password and return instructions
 *
 * This function generates a secure password and provides instructions
 * for storing it in environment variables.
 *
 * @returns Object with password, hash, and instructions
 */
export function createSuperUserPassword(): {
  password: string;
  hash: string;
  instructions: string;
} {
  assertSuperAdminEnabled();

  const password = generateSuperAdminPassword();
  const hash = hashPassword(password);

  const instructions = `
IdeaI DB Manager Password Created

Password: ${password}
Hash: ${hash}

⚠️ IMPORTANT: Store this password securely!

1. Add to your .env.local file:
   SUPER_ADMIN_PASSWORD_HASH=${hash}

2. Store the plain password in a secure password manager
   (DO NOT commit the plain password to git)

3. Use this password to access the IdeaI DB Manager at:
   http://localhost:3000/super-admin

4. The password hash is safe to commit (it's a one-way hash)

⚠️ SECURITY: This feature is DEV-ONLY and will NOT work in production.
`;

  return {
    password,
    hash,
    instructions,
  };
}
