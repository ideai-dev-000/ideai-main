/**
 * @fileoverview Home page for the IdeaI docs application
 * 
 * @module DocsHomePage
 * @description
 * The home page component for the IdeaI documentation site.
 * Renders the documentation index directly.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ./layout.tsx} - Root layout component
 * @see {@link ./docs/[[...slug]]/page.tsx} - Documentation pages
 */

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/docs");
}
