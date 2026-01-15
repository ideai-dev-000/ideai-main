/**
 * @fileoverview User Menu Item for IdeaI Menu
 *
 * @module UserMenuItem
 * @description
 * User menu item component that can be used in IdeaI menus.
 * Shows user info and provides access to user actions.
 */

"use client";

import { User, LogOut, Settings, Key, Plug } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useOverlay } from "@/components/overlays/overlay-provider";
import { SettingsOverlay } from "@/components/overlays/settings-overlay";
import { IntegrationsOverlay } from "@/components/overlays/integrations-overlay";
import { ApiKeysOverlay } from "@/components/overlays/api-keys-overlay";
import { api } from "@/lib/api-client";
import { useEffect, useState } from "react";

export function UserMenuItem() {
  const { data: session } = useSession();
  const { open: openOverlay } = useOverlay();
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user && !session.user.name?.startsWith("Anonymous")) {
      api.user
        .get()
        .then((user) => setProviderId(user.providerId))
        .catch(() => setProviderId(null));
    }
  }, [session?.user]);

  const handleLogout = async () => {
    await signOut();
  };

  const isOAuthUser = providerId && providerId !== "anonymous";

  if (!session?.user) {
    return (
      <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
        Not signed in
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* User Info */}
      <div className="flex items-center gap-3 px-3 py-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user.image || undefined} />
          <AvatarFallback>
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {session.user.name || "User"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {session.user.email}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-1">
        {!isOAuthUser && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => openOverlay(SettingsOverlay)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => openOverlay(IntegrationsOverlay)}
        >
          <Plug className="h-4 w-4 mr-2" />
          Connections
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => openOverlay(ApiKeysOverlay)}
        >
          <Key className="h-4 w-4 mr-2" />
          API Keys
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 dark:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
