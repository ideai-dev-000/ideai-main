/**
 * @fileoverview Portfolio Page Template
 * 
 * @module PortfolioTemplate
 * @description
 * Creative portfolio template with project grid and filters
 */

"use client";

import { Filter } from "lucide-react";

export function PortfolioTemplate() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Showcase of creative projects</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Filters */}
        <div className="flex items-center gap-4 mb-8">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex gap-2 flex-wrap">
            {["All", "Web Design", "Mobile", "Branding", "UI/UX"].map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg border border-input bg-card text-foreground hover:bg-muted transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border border-border cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h3 className="text-xl font-bold mb-2">Project Title {i}</h3>
                  <p className="text-sm opacity-90">Project description and details</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
