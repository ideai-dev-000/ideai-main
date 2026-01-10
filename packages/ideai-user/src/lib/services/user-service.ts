/**
 * @fileoverview User service for IdeaI User Module
 *
 * @module IdeAIUserService
 * @description
 * Service layer for user CRUD operations and user-related queries.
 * Provides type-safe methods for user management.
 *
 * @example
 * ```typescript
 * import { userService } from "@repo/ideai-user/services/user-service";
 *
 * const user = await userService.getById(userId);
 * const updated = await userService.updatePreferences(userId, { theme: "dark" });
 * ```
 */

import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  userPreferences,
  users,
  type NewUserPreference,
  type UserPreference,
  type User,
} from "../db/schema";

/**
 * User service class
 * Provides methods for user operations
 */
export class UserService {
  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<User | null> {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User | null> {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  /**
   * Get user with preferences
   */
  async getWithPreferences(userId: string) {
    const user = await this.getById(userId);
    if (!user) return null;

    const preferences = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, userId),
    });

    return {
      ...user,
      preferences: preferences || {
        theme: "system" as const,
        language: "en",
        notifications: {},
      },
    };
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreference>,
  ): Promise<UserPreference> {
    const existing = await db.query.userPreferences.findFirst({
      where: eq(userPreferences.userId, userId),
    });

    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set({ ...preferences, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userPreferences)
      .values({
        userId,
        ...preferences,
      } as NewUserPreference)
      .returning();
    return created;
  }
}

/**
 * Export singleton instance
 */
export const userService = new UserService();
