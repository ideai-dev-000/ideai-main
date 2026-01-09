"use client";

// Better Auth doesn't need a SessionProvider wrapper
// The useSession hook from authClient works directly
interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <>{children}</>;
}
