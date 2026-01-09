import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthDialog } from "@/components/auth/dialog";
import React from "react";

async function LoginPageInner({ redirectTo }: { redirectTo?: string }) {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (session) {
    // Redirect authenticated users to the intended page or home
    if (redirectTo === "vibe-code") {
      redirect("/?tab=vibe-code");
    } else if (redirectTo === "workflow") {
      redirect("/workflow");
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <AuthDialog open={true} defaultMode="signin" />
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginPageInner redirectTo={params.redirect} />
    </React.Suspense>
  );
}
