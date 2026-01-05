/**
 * @fileoverview Super Admin Page - Dev-Only User Management
 *
 * @module SuperAdminPage
 * @description
 * Page for accessing the super admin panel to view and edit users.
 *
 * ⚠️ CRITICAL: This page is DEV-ONLY and will not work in production.
 * Multiple safeguards prevent accidental deployment.
 */

import { SuperAdminPanel } from "@repo/ideai-db-manager";

export default function SuperAdminPage() {
  return <SuperAdminPanel />;
}
