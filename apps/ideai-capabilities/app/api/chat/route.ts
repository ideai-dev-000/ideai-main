import { NextRequest, NextResponse } from "next/server";
import { createClient, ChatDetail } from "v0-sdk";
import { auth } from "@/lib/auth";
import {
  createChatOwnership,
  createAnonymousChatLog,
  getChatCountByUserId,
  getChatCountByIP,
} from "@/lib/db/queries";
import {
  entitlementsByUserType,
  anonymousEntitlements,
} from "@/lib/entitlements";
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
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const { message, chatId, streaming, attachments, projectId } =
      await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Rate limiting (disabled in development mode)
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!isDevelopment) {
      if (session?.user?.id) {
        // Authenticated user rate limiting
        const chatCount = await getChatCountByUserId({
          userId: session.user.id,
          differenceInHours: 24,
        });

        // Better Auth doesn't have user.type - use anonymous check instead
        const isAnonymous = !session.user || session.user.name === "Anonymous";
        const userType: "guest" | "regular" = isAnonymous ? "guest" : "regular";
        if (chatCount >= entitlementsByUserType[userType].maxMessagesPerDay) {
          return new ChatSDKError("rate_limit:chat").toResponse();
        }

        console.log("API request:", {
          message,
          chatId,
          streaming,
          userId: session.user.id,
        });
      } else {
        // Anonymous user rate limiting
        const clientIP = getClientIP(request);
        const chatCount = await getChatCountByIP({
          ipAddress: clientIP,
          differenceInHours: 24,
        });

        if (chatCount >= anonymousEntitlements.maxMessagesPerDay) {
          return new ChatSDKError("rate_limit:chat").toResponse();
        }

        console.log("API request (anonymous):", {
          message,
          chatId,
          streaming,
          ip: clientIP,
        });
      }
    } else {
      // Development mode: skip rate limiting
      console.log("API request (dev mode - rate limiting disabled):", {
        message,
        chatId,
        streaming,
        userId: session?.user?.id || "anonymous",
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

    // Create ownership mapping or anonymous log for new chat
    if (!chatId && chatDetail.id) {
      try {
        if (session?.user?.id) {
          // Authenticated user - create ownership mapping
          await createChatOwnership({
            v0ChatId: chatDetail.id,
            userId: session.user.id,
          });
          console.log("Chat ownership created:", chatDetail.id);
        } else {
          // Anonymous user - log for rate limiting
          const clientIP = getClientIP(request);
          await createAnonymousChatLog({
            ipAddress: clientIP,
            v0ChatId: chatDetail.id,
          });
          console.log("Anonymous chat logged:", chatDetail.id, "IP:", clientIP);
        }
      } catch (error) {
        console.error("Failed to create chat ownership/log:", error);
        // Don't fail the request if database save fails
      }
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
