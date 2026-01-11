/**
 * @fileoverview Vibe Chat Detail Page
 *
 * @module VibeChatDetailPage
 * @description
 * Page for viewing and interacting with a specific vibe chat.
 */

import { Suspense } from "react";
import { VibeChatDetailClient } from "@/components/vibe/vibe-chat-detail-client";
import { AuthProtectedPage } from "@/components/auth/protected-page";
import { VibeStreamingProvider } from "@/lib/vibe/contexts/streaming-context";

export default function VibeChatDetailPage() {
  return (
    <AuthProtectedPage>
      <VibeStreamingProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <VibeChatDetailClient />
        </Suspense>
      </VibeStreamingProvider>
    </AuthProtectedPage>
  );
}
