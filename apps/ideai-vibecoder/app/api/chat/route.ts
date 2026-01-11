import { NextRequest, NextResponse } from "next/server";
import { createClient, ChatDetail } from "v0-sdk";
import { auth } from "@/lib/auth";
import { createChatOwnership, getChatCountByUserId } from "@/lib/db/queries";
import { entitlementsByUserType } from "@/lib/entitlements";
import { ChatSDKError } from "@/lib/errors";

// Create v0 client with custom baseUrl if V0_API_URL is set
// API key is automatically read from V0_API_KEY environment variable by v0-sdk
const v0 = createClient(
  process.env.V0_API_URL ? { baseUrl: process.env.V0_API_URL } : {},
);

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback to connection remote address or unknown
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // Timeout wrapper for session lookup to prevent hangs
    let session = null;
    try {
      const sessionPromise = auth.api.getSession({
        headers: request.headers,
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Session lookup timeout")), 3000),
      );
      session = await Promise.race([sessionPromise, timeoutPromise]);
    } catch (error) {
      // Log but don't fail - let the auth check below handle it
      if (
        error instanceof Error &&
        error.message === "Session lookup timeout"
      ) {
        console.warn("[Chat API] Session lookup timed out after 3s");
      } else {
        console.warn(
          "[Chat API] Session lookup failed:",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
      session = null;
    }

    // CRITICAL: Require authentication - block anonymous users
    // Be more lenient - if we have a session with a user ID, allow it
    const isAuthenticated =
      session?.user?.id && // Must have a user ID
      session.user.name !== "Anonymous" && // Not anonymous name
      (!session.user.email || !session.user.email.startsWith("temp-")) && // Not temp email
      !session.user.isAnonymous; // Not marked as anonymous

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { message, chatId, streaming, attachments, projectId } =
      await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Rate limiting (disabled in development mode)
    // CRITICAL: Only authenticated users can reach here
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!isDevelopment && session?.user?.id) {
      // Authenticated user rate limiting - with timeout to prevent hangs
      try {
        const rateLimitPromise = getChatCountByUserId({
          userId: session.user.id,
          differenceInHours: 24,
        });
        const timeoutPromise = new Promise<number>((resolve) =>
          setTimeout(() => resolve(0), 2000),
        );
        const chatCount = await Promise.race([
          rateLimitPromise,
          timeoutPromise,
        ]);

        const userType: "regular" = "regular"; // All users are authenticated now
        if (chatCount >= entitlementsByUserType[userType].maxMessagesPerDay) {
          return new ChatSDKError("rate_limit:chat").toResponse();
        }
      } catch (error) {
        // Fail open - if rate limiting check fails, allow request
        console.warn("[Chat API] Rate limit check failed:", error);
      }

      console.log("API request:", {
        message,
        chatId,
        streaming,
        userId: session.user.id,
      });
    } else {
      // Development mode: skip rate limiting
      console.log("API request (dev mode - rate limiting disabled):", {
        message,
        chatId,
        streaming,
        userId: session?.user?.id,
      });
    }

    console.log("Using baseUrl:", process.env.V0_API_URL || "default");

    let chat;

    if (chatId) {
      // continue existing chat
      if (streaming) {
        // Return streaming response for existing chat
        console.log("Sending streaming message to existing chat:", {
          chatId,
          message,
          responseMode: "experimental_stream",
        });
        try {
          chat = await v0.chats.sendMessage({
            chatId: chatId,
            message,
            responseMode: "experimental_stream",
            ...(attachments && attachments.length > 0 && { attachments }),
          });
          console.log("Streaming message sent to existing chat successfully");

          // Verify we got a stream
          if (!(chat instanceof ReadableStream)) {
            throw new Error("Expected streaming response but got non-stream");
          }

          // Return the stream directly
          return new Response(chat as ReadableStream<Uint8Array>, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        } catch (streamError) {
          console.error("Error in streaming response:", streamError);
          // If streaming fails, throw to be caught by outer catch block
          throw streamError;
        }
      } else {
        // Non-streaming response for existing chat
        chat = await v0.chats.sendMessage({
          chatId: chatId,
          message,
          ...(attachments && attachments.length > 0 && { attachments }),
        });
      }
    } else {
      // create new chat
      if (streaming) {
        // Return streaming response
        console.log("Creating streaming chat with params:", {
          message,
          responseMode: "experimental_stream",
        });
        try {
          chat = await v0.chats.create({
            message,
            responseMode: "experimental_stream",
            ...(attachments && attachments.length > 0 && { attachments }),
          });
          console.log("Streaming chat created successfully");

          // Verify we got a stream
          if (!(chat instanceof ReadableStream)) {
            throw new Error("Expected streaming response but got non-stream");
          }

          // Return the stream directly
          return new Response(chat as ReadableStream<Uint8Array>, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        } catch (streamError) {
          console.error("Error in streaming response:", streamError);
          // If streaming fails, throw to be caught by outer catch block
          throw streamError;
        }
      } else {
        // Use sync mode
        console.log("Creating sync chat with params:", {
          message,
          responseMode: "sync",
        });
        chat = await v0.chats.create({
          message,
          responseMode: "sync",
          ...(attachments && attachments.length > 0 && { attachments }),
        });
        console.log("Sync chat created successfully");
      }
    }

    // Type guard to ensure we have a ChatDetail and not a stream
    if (chat instanceof ReadableStream) {
      throw new Error("Unexpected streaming response");
    }

    const chatDetail = chat as ChatDetail;

    // Create ownership mapping for new chat (non-blocking)
    // CRITICAL: Only authenticated users can reach here
    // Run this async - don't block the response
    if (!chatId && chatDetail.id && session?.user?.id) {
      // Fire and forget - don't await, don't block response
      createChatOwnership({
        v0ChatId: chatDetail.id,
        userId: session.user.id,
      }).catch((error) => {
        console.error("Failed to create chat ownership (non-blocking):", error);
        // Silently fail - ownership tracking is not critical
      });
    }

    return NextResponse.json({
      id: chatDetail.id,
      demo: chatDetail.demo,
      messages: chatDetail.messages?.map((msg) => ({
        ...msg,
        experimental_content: (msg as any).experimental_content,
      })),
    });
  } catch (error) {
    console.error("V0 API Error:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Log the full error object if available
      if ("cause" in error) {
        console.error("Error cause:", error.cause);
      }
    }

    // Extract more detailed error information
    let errorMessage = "Failed to process request";
    let errorDetails = "Unknown error";

    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
      errorDetails = error.message;

      // Check if it's a v0 SDK error
      if ("response" in error || "status" in error) {
        console.error("API Error Response:", (error as any).response);
        console.error("API Error Status:", (error as any).status);
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        message: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
