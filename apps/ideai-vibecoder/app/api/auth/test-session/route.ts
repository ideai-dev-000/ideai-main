/**
 * @fileoverview Test endpoint for debugging session retrieval
 *
 * @module AuthSessionTest
 * @description
 * Test endpoint to diagnose why session retrieval is failing.
 */

import { NextResponse } from "next/server";
import { auth } from "@repo/ideai-user/auth";

export async function GET() {
  try {
    // Try to get session
    let sessionResult;
    let sessionError = null;

    try {
      // Create a mock request to test session retrieval
      const headers = new Headers();
      // Add any cookies from the request

      sessionResult = await auth.api.getSession({
        headers,
      });
    } catch (error) {
      sessionError = {
        message: error instanceof Error ? error.message : "Unknown error",
        name: error instanceof Error ? error.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined,
      };
    }

    return NextResponse.json({
      status: "ok",
      session: sessionResult
        ? {
            user: sessionResult.user
              ? {
                  id: sessionResult.user.id,
                  name: sessionResult.user.name,
                  email: sessionResult.user.email,
                }
              : null,
          }
        : null,
      error: sessionError,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
