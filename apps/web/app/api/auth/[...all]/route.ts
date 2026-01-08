import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@repo/ideai-auth/server";

/**
 * @fileoverview Auth API route handler for web app
 *
 * @module AuthAPI
 * @description
 * Handles all authentication API requests using shared IdeaI auth system.
 * All auth endpoints are handled by Better Auth through this catch-all route.
 */

export const { GET, POST } = toNextJsHandler(auth);
