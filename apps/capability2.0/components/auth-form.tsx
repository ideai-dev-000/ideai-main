"use client";

import { useState, FormEvent } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "signin" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      if (type === "signup") {
        const signUpResponse = await signUp.email({
          email,
          password,
        });
        if (signUpResponse.error) {
          setError(signUpResponse.error.message || "Sign up failed");
          setIsPending(false);
          return;
        }

        // After signup, sign in automatically
        const signInResponse = await signIn.email({
          email,
          password,
        });
        if (signInResponse.error) {
          setError(signInResponse.error.message || "Sign in failed");
          setIsPending(false);
          return;
        }
      } else {
        const signInResponse = await signIn.email({
          email,
          password,
        });
        if (signInResponse.error) {
          setError(signInResponse.error.message || "Sign in failed");
          setIsPending(false);
          return;
        }
      }

      // Success - redirect to home
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          minLength={type === "signup" ? 6 : 1}
        />
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? type === "signin"
            ? "Signing in..."
            : "Creating account..."
          : type === "signin"
            ? "Sign In"
            : "Create Account"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {type === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
