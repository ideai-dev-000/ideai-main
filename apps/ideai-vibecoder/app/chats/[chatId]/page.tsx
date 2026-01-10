/**
 * @fileoverview Chat detail page - protected route
 *
 * @module ChatDetailPage
 * @description
 * Protected chat detail page - requires authentication.
 */

import { ChatDetailClient } from "@/components/chats/chat-detail-client";
import { AuthProtectedPage } from "@/components/auth/protected-page";

export default function ChatDetailPage() {
  return (
    <AuthProtectedPage>
      <ChatDetailClient />
    </AuthProtectedPage>
  );
}
