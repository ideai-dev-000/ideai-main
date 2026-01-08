import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo V0 App - IdeaI",
  description: "Demo v0-generated Next.js app showcasing the v0 apps system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
