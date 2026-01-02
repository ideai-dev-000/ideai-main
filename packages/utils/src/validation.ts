import { z } from "zod"

/**
 * Common Zod validation schemas
 */

export const emailSchema = z.string().email("Invalid email address")

export const urlSchema = z.string().url("Invalid URL")

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")

/**
 * Helper to create safe parsers
 */
export function createSafeParser<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => {
    const result = schema.safeParse(data)
    if (result.success) {
      return { success: true, data: result.data }
    }
    return { success: false, errors: result.error.errors }
  }
}
