import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthDialog } from "@/components/auth/dialog";

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <AuthDialog open={true} defaultMode="signup" />
    </div>
  );
}
