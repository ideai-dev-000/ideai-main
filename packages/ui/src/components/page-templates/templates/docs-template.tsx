/**
 * @fileoverview Documentation Page Template
 *
 * @module DocsTemplate
 * @description
 * Documentation layout with sidebar navigation and content
 */

"use client";

import { Search, Book } from "lucide-react";

export function DocsTemplate() {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Docs</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
            />
          </div>
        </div>
        <nav className="space-y-1">
          {[
            "Getting Started",
            "Installation",
            "Configuration",
            "API Reference",
            "Examples",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="block px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground text-sm transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="#" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Documentation
          </a>
          <span>/</span>
          <span className="text-foreground">Getting Started</span>
        </nav>

        {/* Content */}
        <article className="max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Getting Started
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Learn how to get started with our platform in minutes.
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Installation
            </h2>
            <p className="text-foreground mb-4">
              Install the package using your preferred package manager.
            </p>
            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 mb-6">
              <code className="text-green-400 text-sm">
                npm install package-name
              </code>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
              Quick Start
            </h2>
            <p className="text-foreground mb-4">
              Get up and running with a simple example.
            </p>
            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4">
              <pre className="text-green-400 text-sm">
                <code>{`import { Component } from 'package-name';

function App() {
  return <Component />;
}`}</code>
              </pre>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
