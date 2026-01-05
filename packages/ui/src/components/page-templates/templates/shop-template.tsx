/**
 * @fileoverview Shop/E-commerce Page Template
 * 
 * @module ShopTemplate
 * @description
 * E-commerce grid template with filters and product cards
 */

"use client";

import { Search, ShoppingCart, Filter, SlidersHorizontal } from "lucide-react";

export function ShopTemplate() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Shop</h1>
            <button className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Filters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3">Category</h3>
                  <div className="space-y-2">
                    {["Electronics", "Clothing", "Home", "Sports"].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-muted-foreground">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-3">Price</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" className="rounded" />
                      <span className="text-sm text-muted-foreground">$0 - $50</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" className="rounded" />
                      <span className="text-sm text-muted-foreground">$50 - $100</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" className="rounded" />
                      <span className="text-sm text-muted-foreground">$100+</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">Showing 24 products</p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <select className="border border-input rounded-lg px-3 py-1.5 bg-background text-foreground">
                  <option>Sort by: Price</option>
                  <option>Sort by: Name</option>
                  <option>Sort by: Rating</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-muted to-muted/50" />
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">
                      Product Name {i}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Product description goes here
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        ${(i * 29.99).toFixed(2)}
                      </span>
                      <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
