/**
 * @fileoverview Landing Page Template
 * 
 * @module LandingTemplate
 * @description
 * Modern landing page with hero, features, and CTA sections
 */

"use client";

import { Check, ArrowRight } from "lucide-react";

export function LandingTemplate() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Build Amazing Products</h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            The all-in-one platform for building modern web applications with ease
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you build, deploy, and scale your applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Fast Performance", desc: "Lightning-fast load times" },
              { title: "Secure by Default", desc: "Built-in security features" },
              { title: "Easy to Use", desc: "Intuitive interface and tools" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-lg border border-border p-6"
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers building amazing products
          </p>
          <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}

