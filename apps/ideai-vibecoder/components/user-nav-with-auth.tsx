/**
 * @fileoverview User navigation with shared AuthDialog integration
 *
 * @module UserNavWithAuth
 * @description
 * User navigation component that uses the shared AuthDialog from @repo/ideai-user.
 * Replaces links to /login and /register with the AuthDialog component.
 */

"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { AuthDialog } from "@repo/ideai-user/components/auth";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

interface UserNavProps {
  session: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
      isAnonymous: boolean | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
  } | null;
}

export function UserNavWithAuth({ session }: UserNavProps) {
  const initials =
    session?.user?.email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "U";

  // Better Auth doesn't have a "guest" type - use anonymous check instead
  const isAnonymous = !session?.user || session.user.name === "Anonymous";
  const isSignedOut = !session;

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    window.location.href = "/";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {isSignedOut ? <User className="h-4 w-4" /> : initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {isSignedOut
                  ? "Not signed in"
                  : isAnonymous
                    ? "Anonymous User"
                    : "User"}
              </p>
              {session?.user?.email && (
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(isAnonymous || isSignedOut) && (
            <>
              <div className="px-2 py-1.5">
                <AuthDialog
                  Button={Button}
                  Dialog={Dialog}
                  DialogContent={DialogContent}
                  DialogDescription={DialogDescription}
                  DialogHeader={DialogHeader}
                  DialogTitle={DialogTitle}
                  DialogTrigger={DialogTrigger}
                  Input={Input}
                  Label={Label}
                  Separator={Separator}
                  Spinner={Spinner}
                  toast={toast}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </AuthDialog>
              </div>
              {!isSignedOut && <DropdownMenuSeparator />}
            </>
          )}
          {!isSignedOut && (
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
