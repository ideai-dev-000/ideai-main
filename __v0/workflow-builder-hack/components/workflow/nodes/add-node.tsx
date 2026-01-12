"use client";

import type { NodeProps } from "@xyflow/react";
import { CheckCircle2, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { getAppMode, getModeConfig } from "@/lib/modes";

type AddNodeData = {
  onClick?: () => void;
};

export function AddNode({ data }: NodeProps & { data?: AddNodeData }) {
  const { data: session, isPending: isSessionPending } = useSession();
  const modeConfig = getModeConfig();
  const currentMode = getAppMode();

  // Determine login state
  const isLoggedIn =
    !isSessionPending &&
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  const userDisplayName =
    session?.user?.name || session?.user?.email || "Not logged in";

  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-border border-dashed bg-background/50 p-8 backdrop-blur-sm">
      <div className="text-center">
        <h1 className="mb-2 font-bold text-3xl">{modeConfig.title}</h1>
        {modeConfig.subtitle && (
          <p className="mb-4 text-muted-foreground text-sm">
            {modeConfig.subtitle}
          </p>
        )}

        {/* Mode and Login Status */}
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs uppercase">
              Mode:
            </span>
            <span className="font-medium text-xs">{currentMode}</span>
          </div>
          <div className="flex items-center gap-2">
            {isSessionPending ? (
              <>
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground text-xs">
                  Checking status...
                </span>
              </>
            ) : isLoggedIn ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span className="text-muted-foreground text-xs">
                  Logged in as {userDisplayName}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">
                  Not logged in
                </span>
              </>
            )}
          </div>
        </div>

        {/* Branding (only if enabled) */}
        {modeConfig.branding?.show && modeConfig.branding.links && (
          <p className="text-muted-foreground text-sm">
            {modeConfig.branding.text}{" "}
            {modeConfig.branding.links.map((link, index, array) => (
              <span key={link.url}>
                <a
                  className="underline underline-offset-2 transition duration-200 ease-out hover:text-foreground"
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
                {index < array.length - 2 && ", "}
                {index === array.length - 2 && " and "}
              </span>
            ))}
          </p>
        )}
      </div>
      <Button className="gap-2 shadow-lg" onClick={data.onClick} size="default">
        <Plus className="size-4" />
        {modeConfig.addButtonLabel}
      </Button>
    </div>
  );
}
