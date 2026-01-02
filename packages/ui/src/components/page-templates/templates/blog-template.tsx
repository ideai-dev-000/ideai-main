/**
 * @fileoverview Blog Page Template
 * 
 * @module BlogTemplate
 * @description
 * Blog listing template with featured posts and categories
 */

"use client";

import { Search, Calendar, User } from "lucide-react";

export function BlogTemplate() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Blog</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Post */}
        <div className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="max-w-2xl">
            <span className="text-sm font-medium opacity-90 mb-2 block">Featured</span>
            <h2 className="text-3xl font-bold mb-4">Getting Started with Next.js 16</h2>
            <p className="text-lg opacity-90 mb-6">
              Learn how to build modern web applications with the latest features of Next.js
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                John Doe
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Jan 2, 2024
              </span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["All", "React", "Next.js", "TypeScript", "Web Development"].map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-lg border border-input bg-card text-foreground hover:bg-muted transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <article
              key={i}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-muted to-muted/50" />
              <div className="p-6">
                <span className="text-sm text-primary font-medium">
                  React
                </span>
                <h3 className="text-xl font-semibold text-foreground mt-2 mb-2">
                  Article Title {i}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Brief description of the article content and what readers can expect...
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Jan {i}, 2024</span>
                  <span>5 min read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
