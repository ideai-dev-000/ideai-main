/**
 * @fileoverview Dashboard Page Template
 * 
 * @module DashboardTemplate
 * @description
 * Analytics dashboard template with sidebar, header stats, and charts
 */

"use client";

import { LayoutDashboard, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export function DashboardTemplate() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
        </div>
        <nav className="space-y-2">
          {["Overview", "Analytics", "Reports", "Settings"].map((item) => (
            <a
              key={item}
              href="#"
              className="block px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: "Total Revenue", value: "$45,231", change: "+20.1%" },
            { icon: Users, label: "Active Users", value: "2,350", change: "+12.5%" },
            { icon: DollarSign, label: "Sales", value: "1,234", change: "+8.2%" },
            { icon: Activity, label: "Growth", value: "23.5%", change: "+4.3%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
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
