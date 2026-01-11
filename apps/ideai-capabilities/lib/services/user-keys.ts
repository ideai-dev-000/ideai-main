/**
 * @fileoverview User Service Keys Management
 *
 * @module UserKeysService
 * @description
 * Centralized service for managing user API keys (AI Gateway, OpenAI, etc.)
 * Stores encrypted keys in database with environment fallback to process.env
 *
 * Priority: User key (from DB) > Environment variable
 */

import "server-only";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { userServiceKeys } from "../db/schema";
import { encrypt, decrypt } from "../db/integrations";

export type ServiceType =
  | "ai_gateway"
  | "openai"
  | "v0"
  | "anthropic"
  | "firecrawl"
  | "exa";

export type Environment = "local" | "production" | "preview";

export interface UserKeyConfig {
  userId: string;
  serviceType: ServiceType;
  key: string;
  environment?: Environment;
  vercelProjectId?: string;
  vercelTeamId?: string;
}

export interface UserKeyInfo {
  id: string;
  serviceType: ServiceType;
  keyPrefix: string | null;
  environment: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  hasKey: boolean; // Whether a key is actually set (decrypted successfully)
}

/**
 * Map service type to environment variable name
 */
function getEnvVarName(serviceType: ServiceType): string {
  const mapping: Record<ServiceType, string> = {
    ai_gateway: "AI_GATEWAY_API_KEY",
    openai: "OPENAI_API_KEY",
    v0: "V0_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    firecrawl: "FIRECRAWL_API_KEY",
    exa: "EXA_API_KEY",
  };
  return mapping[serviceType];
}

/**
 * Save or update user API key (encrypted)
 */
export async function saveUserKey(config: UserKeyConfig): Promise<void> {
  const encrypted = encrypt(config.key);
  const keyPrefix =
    config.key.length >= 4 ? `...${config.key.slice(-4)}` : "...****";

  const environment = config.environment || "production";

  // Use upsert to create or update
  const existing = await db.query.userServiceKeys.findFirst({
    where: and(
      eq(userServiceKeys.userId, config.userId),
      eq(userServiceKeys.serviceType, config.serviceType),
      eq(userServiceKeys.environment, environment),
    ),
  });

  if (existing) {
    // Update existing
    await db
      .update(userServiceKeys)
      .set({
        encryptedKey: encrypted,
        keyPrefix: keyPrefix,
        vercelProjectId: config.vercelProjectId,
        vercelTeamId: config.vercelTeamId,
        updatedAt: new Date(),
        isActive: true,
      })
      .where(eq(userServiceKeys.id, existing.id));
  } else {
    // Create new
    await db.insert(userServiceKeys).values({
      userId: config.userId,
      serviceType: config.serviceType,
      encryptedKey: encrypted,
      keyPrefix: keyPrefix,
      environment: environment,
      vercelProjectId: config.vercelProjectId,
      vercelTeamId: config.vercelTeamId,
      isActive: true,
    });
  }
}

/**
 * Get user API key (decrypted) with environment fallback
 * Priority: User key (from DB) > Environment variable
 *
 * @returns Decrypted key or null if not found
 */
export async function getUserKey(
  userId: string,
  serviceType: ServiceType,
  environment: Environment = "production",
): Promise<string | null> {
  // Try user key first
  const userKey = await db.query.userServiceKeys.findFirst({
    where: and(
      eq(userServiceKeys.userId, userId),
      eq(userServiceKeys.serviceType, serviceType),
      eq(userServiceKeys.environment, environment),
      eq(userServiceKeys.isActive, true),
    ),
  });

  if (userKey) {
    try {
      const decrypted = decrypt(userKey.encryptedKey);
      // Update last used timestamp
      await db
        .update(userServiceKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(userServiceKeys.id, userKey.id));
      return decrypted;
    } catch (error) {
      console.error(
        `[UserKeys] Failed to decrypt key for ${serviceType}:`,
        error,
      );
      // Continue to fallback
    }
  }

  // Fallback to environment variable
  const envVarName = getEnvVarName(serviceType);
  return process.env[envVarName] || null;
}

/**
 * Get all user keys (for UI display)
 * Returns key info without decrypted values
 */
export async function getUserKeys(userId: string): Promise<UserKeyInfo[]> {
  const keys = await db.query.userServiceKeys.findMany({
    where: eq(userServiceKeys.userId, userId),
    orderBy: (keys, { desc }) => [desc(keys.updatedAt)],
  });

  // Check if keys can be decrypted (to show if they're valid)
  return Promise.all(
    keys.map(async (key) => {
      let hasKey = false;
      try {
        decrypt(key.encryptedKey);
        hasKey = true;
      } catch {
        hasKey = false;
      }

      return {
        id: key.id,
        serviceType: key.serviceType as ServiceType,
        keyPrefix: key.keyPrefix,
        environment: key.environment || "production",
        isActive: key.isActive,
        lastUsedAt: key.lastUsedAt,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt,
        hasKey,
      };
    }),
  );
}

/**
 * Get specific user key info (without decrypted value)
 */
export async function getUserKeyInfo(
  userId: string,
  serviceType: ServiceType,
  environment: Environment = "production",
): Promise<UserKeyInfo | null> {
  const key = await db.query.userServiceKeys.findFirst({
    where: and(
      eq(userServiceKeys.userId, userId),
      eq(userServiceKeys.serviceType, serviceType),
      eq(userServiceKeys.environment, environment),
    ),
  });

  if (!key) return null;

  let hasKey = false;
  try {
    decrypt(key.encryptedKey);
    hasKey = true;
  } catch {
    hasKey = false;
  }

  return {
    id: key.id,
    serviceType: key.serviceType as ServiceType,
    keyPrefix: key.keyPrefix,
    environment: key.environment || "production",
    isActive: key.isActive,
    lastUsedAt: key.lastUsedAt,
    createdAt: key.createdAt,
    updatedAt: key.updatedAt,
    hasKey,
  };
}

/**
 * Delete user key
 */
export async function deleteUserKey(
  userId: string,
  keyId: string,
): Promise<void> {
  // Verify ownership
  const key = await db.query.userServiceKeys.findFirst({
    where: and(
      eq(userServiceKeys.id, keyId),
      eq(userServiceKeys.userId, userId),
    ),
  });

  if (!key) {
    throw new Error("Key not found or access denied");
  }

  await db.delete(userServiceKeys).where(eq(userServiceKeys.id, keyId));
}

/**
 * Check if user has a key configured (checks both DB and env)
 */
export async function hasUserKey(
  userId: string,
  serviceType: ServiceType,
  environment: Environment = "production",
): Promise<boolean> {
  // Check DB first
  const userKey = await db.query.userServiceKeys.findFirst({
    where: and(
      eq(userServiceKeys.userId, userId),
      eq(userServiceKeys.serviceType, serviceType),
      eq(userServiceKeys.environment, environment),
      eq(userServiceKeys.isActive, true),
    ),
  });

  if (userKey) {
    try {
      decrypt(userKey.encryptedKey);
      return true;
    } catch {
      // Invalid key, continue to env check
    }
  }

  // Check environment variable
  const envVarName = getEnvVarName(serviceType);
  return !!process.env[envVarName];
}
