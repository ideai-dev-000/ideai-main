/**
 * @fileoverview Chats page - protected route
 *
 * @module ChatsPage
 * @description
 * Protected chats list page - requires authentication.
 */

import { Suspense } from "react";
import { ChatsClient } from "@/components/chats/chats-client";
import { AuthProtectedPage } from "@/components/auth/protected-page";

export default function ChatsPage() {
  return (
    <AuthProtectedPage>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatsClient />
      </Suspense>
    </AuthProtectedPage>
  );
}
