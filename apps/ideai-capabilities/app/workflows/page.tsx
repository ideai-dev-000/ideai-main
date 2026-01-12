/**
 * @fileoverview Workflows page - Shows card for new workflow
 *
 * @module WorkflowsPage
 * @description
 * Redirects to /workflow which shows the card for creating a new workflow
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkflowsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /workflow which shows the card
    router.replace("/workflow");
  }, [router]);

  return null;
}
