/**
 * @fileoverview Better Auth API route handler for IdeaI VibeCoder
 *
 * @module AuthRoute
 * @description
 * Uses centralized auth from @repo/ideai-user for unified authentication
 * across all IdeaI apps.
 */

import { auth } from "@repo/ideai-user/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
