/**
 * @fileoverview Documentation navigation component
 * 
 * @module DocsNav
 * @description
 * Sidebar navigation for the documentation site.
 * Provides links to all documentation sections.
 * 
 * @example
 * <DocsNav />
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/docs", label: "Documentation Index" },
  { href: "/docs/project-summary", label: "Project Summary" },
  { href: "/docs/contributing", label: "Contributing" },
  {
    label: "Setup",
    children: [
      { href: "/docs/setup/github-secrets", label: "GitHub Secrets" },
      { href: "/docs/setup/vercel-checklist", label: "Vercel Checklist" },
      { href: "/docs/setup/commit-signing", label: "Commit Signing" },
    ],
  },
  {
    label: "Development",
    children: [
      { href: "/docs/development/getting-started", label: "Getting Started" },
    ],
  },
  {
    label: "Deployment",
    children: [
      { href: "/docs/deployment/overview", label: "Overview" },
      { href: "/docs/deployment/ci-cd", label: "CI/CD Workflows" },
      { href: "/docs/deployment/vercel", label: "Vercel Configuration" },
      { href: "/docs/deployment/troubleshooting", label: "Troubleshooting" },
      { href: "/docs/deployment/commit-signing-ci", label: "Commit Signing in CI" },
    ],
  },
  {
    label: "Tools",
    children: [
      { href: "/docs/tools/code-context", label: "Code Context" },
    ],
  },
  {
    label: "Tasks",
    children: [
      { href: "/docs/tasks/code-context-integration", label: "Code Context Integration" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 p-4 border-r border-gray-200 dark:border-gray-800 h-screen overflow-y-auto sticky top-0">
      <div className="mb-6">
        <Link href="/docs" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          IdeaI Docs
        </Link>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href || item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname === item.href
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {item.label}
                </div>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block px-6 py-2 rounded-md text-sm ${
                      pathname === child.href
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
