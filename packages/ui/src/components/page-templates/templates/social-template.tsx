/**
 * @fileoverview Social Feed Page Template
 * 
 * @module SocialTemplate
 * @description
 * Social media feed template with posts and interactions
 */

"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";

export function SocialTemplate() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="bg-card rounded-lg border border-border p-4 mb-6 sticky top-4 z-10">
          <h1 className="text-2xl font-bold text-foreground">Social Feed</h1>
        </header>

        {/* Post Composer */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
            <div className="flex-1">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-3 border border-input rounded-lg bg-background text-foreground resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-muted rounded">
                    <span className="text-sm">📷</span>
                  </button>
                  <button className="p-2 hover:bg-muted rounded">
                    <span className="text-sm">😊</span>
                  </button>
                </div>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <article
              key={i}
              className="bg-card rounded-lg border border-border p-6"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                  <div>
                    <h3 className="font-semibold text-foreground">User Name</h3>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded">
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Post Content */}
              <p className="text-foreground mb-4">
                This is a sample post content. It can contain text, images, links, and more.
                Users can interact with posts through likes, comments, and shares.
              </p>

              {/* Post Image */}
              <div className="h-64 bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-4" />

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400">
                    <Heart className="h-5 w-5" />
                    <span>24</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">
                    <MessageCircle className="h-5 w-5" />
                    <span>8</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-green-600 dark:hover:text-green-400">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

