/**
 * @fileoverview IdeaI DB Manager Panel Component
 *
 * @module SuperAdminPanel
 * @description
 * Main component for the IdeaI DB Manager panel. Displays user list and allows
 * editing user data. DEV-ONLY - never deploy to production.
 */

"use client";

import { useState, useEffect } from "react";
import { useSuperAdminAuth } from "../hooks/use-super-admin-auth";
import { assertSuperAdminEnabled } from "../utils/dev-check";

/**
 * User data structure
 */
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  image: string | null;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Super Admin Panel Props
 */
export interface SuperAdminPanelProps {
  /**
   * API endpoint for fetching users
   * @default "/api/super-admin/users"
   */
  usersEndpoint?: string;

  /**
   * API endpoint for updating users
   * @default "/api/super-admin/users"
   */
  updateEndpoint?: string;
}

/**
 * Super Admin Panel Component
 *
 * ⚠️ DEV-ONLY: This component will not render in production
 */
export function SuperAdminPanel({
  usersEndpoint = "/api/super-admin/users",
  updateEndpoint = "/api/super-admin/users",
}: SuperAdminPanelProps) {
  const {
    isAuthenticated,
    isChecking,
    error,
    verifyPassword,
    logout,
    superUserName,
  } = useSuperAdminAuth();
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Runtime check - prevent rendering in production
  useEffect(() => {
    try {
      assertSuperAdminEnabled();
    } catch (err) {
      console.error(err);
      return;
    }
  }, []);

  // Fetch users when authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(usersEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword(password);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await fetch(`${updateEndpoint}/${updatedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Refresh users list
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-800">
          <h1 className="mb-4 text-2xl font-bold">IdeaI DB Manager Login</h1>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Access restricted to {superUserName}
          </p>

          {error && (
            <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          {isChecking ? (
            <div className="text-center">Checking...</div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Login
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-slate-500">
            ⚠️ DEV-ONLY: This feature is not available in production
          </p>
        </div>
      </div>
    );
  }

  // Show user list
  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Logged in as {superUserName}
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow dark:border-slate-800 dark:bg-slate-800">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Verified
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Anonymous
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >
                    <td className="px-4 py-3 text-sm font-mono">
                      {user.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm">{user.name || "-"}</td>
                    <td className="px-4 py-3 text-sm">{user.email || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      {user.emailVerified ? "✓" : "✗"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.isAnonymous ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onSave={handleSave}
            onClose={() => setEditingUser(null)}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Edit User Modal Component
 */
function EditUserModal({
  user,
  onSave,
  onClose,
}: {
  user: User;
  onSave: (user: User) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name: name || null,
      email: email || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-800">
        <h2 className="mb-4 text-xl font-bold">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
