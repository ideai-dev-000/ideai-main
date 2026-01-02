/**
 * @fileoverview Admin Panel Page Template
 * 
 * @module AdminTemplate
 * @description
 * Admin dashboard template with data tables and management tools
 */

"use client";

import { Settings, Users, Database, BarChart3, MoreVertical } from "lucide-react";
import { Badge } from "../../ui/badge";

export function AdminTemplate() {
  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6">
        <div className="flex items-center gap-2 mb-8">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Admin</h2>
        </div>
        <nav className="space-y-2">
          {[
            { icon: BarChart3, label: "Dashboard" },
            { icon: Users, label: "Users" },
            { icon: Database, label: "Data" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage users, permissions, and access controls
          </p>
        </header>

        {/* Data Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Users</h2>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm">
                Add User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
                  { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
                  { name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
                ].map((user, i) => (
                  <tr key={i} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={user.status === "Active" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="p-2 hover:bg-muted rounded">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

