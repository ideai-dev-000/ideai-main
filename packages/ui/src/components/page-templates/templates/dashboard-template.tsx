/**
 * @fileoverview Dashboard Page Template
 *
 * @module DashboardTemplate
 * @description
 * Analytics dashboard template with header stats and charts
 */

"use client";

import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export function DashboardTemplate() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Main Content */}
      <main className="p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: TrendingUp,
              label: "Total Revenue",
              value: "$45,231",
              change: "+20.1%",
            },
            {
              icon: Users,
              label: "Active Users",
              value: "2,350",
              change: "+12.5%",
            },
            {
              icon: DollarSign,
              label: "Sales",
              value: "1,234",
              change: "+8.2%",
            },
            {
              icon: Activity,
              label: "Growth",
              value: "23.5%",
              change: "+4.3%",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tailwind Color & Opacity Demo */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Tailwind Color Palette & Opacity
          </h3>

          {/* Color Swatches */}
          <div className="space-y-8">
            {/* Blue Scale */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Blue Scale (bg-blue-*)
              </h4>
              <div className="grid grid-cols-10 gap-2 mb-4">
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-50 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    50
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-100 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    100
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-200 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    200
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-300 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    300
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-400 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    400
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    500
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-600 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    600
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-700 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    700
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-800 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    800
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-900 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    900
                  </p>
                </div>
              </div>
              {/* Opacity Variations */}
              <div className="grid grid-cols-8 gap-2">
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-100" />
                  <p className="text-xs text-center text-muted-foreground">
                    100%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-90" />
                  <p className="text-xs text-center text-muted-foreground">
                    90%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-75" />
                  <p className="text-xs text-center text-muted-foreground">
                    75%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-50" />
                  <p className="text-xs text-center text-muted-foreground">
                    50%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-25" />
                  <p className="text-xs text-center text-muted-foreground">
                    25%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-10" />
                  <p className="text-xs text-center text-muted-foreground">
                    10%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-blue-500 rounded border border-border/50 opacity-5" />
                  <p className="text-xs text-center text-muted-foreground">
                    5%
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-muted rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    0%
                  </p>
                </div>
              </div>
            </div>

            {/* Green Scale */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Green Scale (bg-green-*)
              </h4>
              <div className="grid grid-cols-10 gap-2">
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-50 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    50
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-100 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    100
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-200 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    200
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-300 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    300
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-400 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    400
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-500 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    500
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-600 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    600
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-700 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    700
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-800 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    800
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-green-900 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    900
                  </p>
                </div>
              </div>
            </div>

            {/* Red Scale */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Red Scale (bg-red-*)
              </h4>
              <div className="grid grid-cols-10 gap-2">
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-50 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    50
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-100 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    100
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-200 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    200
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-300 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    300
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-400 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    400
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-500 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    500
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-600 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    600
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-700 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    700
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-800 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    800
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-red-900 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    900
                  </p>
                </div>
              </div>
            </div>

            {/* Purple Scale */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Purple Scale (bg-purple-*)
              </h4>
              <div className="grid grid-cols-10 gap-2">
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-50 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    50
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-100 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    100
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-200 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    200
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-300 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    300
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-400 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    400
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-500 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    500
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-600 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    600
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-700 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    700
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-800 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    800
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-purple-900 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    900
                  </p>
                </div>
              </div>
            </div>

            {/* Slate Scale (Theme-aware) */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Slate Scale (bg-slate-*) - Theme-aware
              </h4>
              <div className="grid grid-cols-10 gap-2">
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-50 dark:bg-slate-900 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    50
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    100
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    200
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-300 dark:bg-slate-600 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    300
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-400 dark:bg-slate-500 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    400
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-500 dark:bg-slate-400 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    500
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-600 dark:bg-slate-300 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    600
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-700 dark:bg-slate-200 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    700
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-800 dark:bg-slate-100 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    800
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="h-12 w-full bg-slate-900 dark:bg-slate-50 rounded border border-border/50" />
                  <p className="text-xs text-center text-muted-foreground">
                    900
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Buttons Demo */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Color Button Variations
          </h3>

          <div className="space-y-6">
            {/* Primary Colors */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Primary Colors
              </h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Blue
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Green
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Red
                </button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                  Purple
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                  Yellow
                </button>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                  Indigo
                </button>
                <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                  Pink
                </button>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                  Teal
                </button>
              </div>
            </div>

            {/* Opacity Variations */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Opacity Variations (bg-blue-500/opacity-*)
              </h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-500/100 text-white rounded-lg border border-blue-400">
                  100%
                </button>
                <button className="px-4 py-2 bg-blue-500/75 text-white rounded-lg border border-blue-400">
                  75%
                </button>
                <button className="px-4 py-2 bg-blue-500/50 text-white rounded-lg border border-blue-400">
                  50%
                </button>
                <button className="px-4 py-2 bg-blue-500/25 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-400">
                  25%
                </button>
                <button className="px-4 py-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-400">
                  10%
                </button>
              </div>
            </div>

            {/* Light Variants */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Light Variants
              </h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  Blue 100
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                  Green 100
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                  Red 100
                </button>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  Purple 100
                </button>
              </div>
            </div>

            {/* Dark Variants */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Dark Variants
              </h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                  Blue 700
                </button>
                <button className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                  Green 700
                </button>
                <button className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">
                  Red 700
                </button>
                <button className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors">
                  Purple 700
                </button>
              </div>
            </div>

            {/* Gradient Buttons */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">
                Gradient Buttons
              </h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                  Blue to Purple
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all">
                  Green to Teal
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all">
                  Red to Pink
                </button>
                <button className="px-4 py-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Multi-color
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Revenue Chart
            </h3>
            <div className="h-64 bg-muted rounded flex items-center justify-center">
              <p className="text-muted-foreground">Chart placeholder</p>
            </div>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              User Activity
            </h3>
            <div className="h-64 bg-muted rounded flex items-center justify-center">
              <p className="text-muted-foreground">Chart placeholder</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
