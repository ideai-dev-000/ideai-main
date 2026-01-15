/**
 * @fileoverview Vibe Chat Detail Page
 *
 * @module VibeChatDetailPage
 * @description
 * Page for viewing and interacting with a specific vibe chat.
 */

import { Suspense } from "react";
import { VibeChatDetailPreview } from "@/components/vibe/vibe-chat-detail-preview";
import { AuthProtectedPage } from "@/components/auth/protected-page";

export default function VibeChatDetailPage() {
  return (
    <AuthProtectedPage>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <VibeChatDetailPreview />
      </Suspense>
    </AuthProtectedPage>
  );
}
