import { Geist, Geist_Mono } from "next/font/google";

export const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});
