/**
 * @fileoverview Streaming Context Provider
 *
 * @module VibeStreamingContext
 * @description
 * Composable context for managing streaming handoff between vibe pages.
 * Handles streaming state when navigating from home to chat detail.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { VibeStreamingHandoff } from "../types/vibe-types";

interface VibeStreamingContextType {
  handoff: VibeStreamingHandoff;
  startHandoff: (
    chatId: string,
    stream: ReadableStream<Uint8Array>,
    userMessage: string,
  ) => void;
  clearHandoff: () => void;
  isStreamingEnabled: boolean;
  toggleStreaming: () => void;
}

const VibeStreamingContext = createContext<VibeStreamingContextType | null>(
  null,
);

/**
 * Hook to access streaming context
 */
export function useVibeStreaming() {
  const context = useContext(VibeStreamingContext);
  if (!context) {
    throw new Error(
      "useVibeStreaming must be used within a VibeStreamingProvider",
    );
  }
  return context;
}

interface VibeStreamingProviderProps {
  children: ReactNode;
}

/**
 * Provider for vibe streaming context
 */
export function VibeStreamingProvider({
  children,
}: VibeStreamingProviderProps) {
  const [handoff, setHandoff] = useState<VibeStreamingHandoff>({
    chatId: null,
    stream: null,
    userMessage: null,
  });

  // Streaming toggle state - default to true, persist in localStorage
  const [isStreamingEnabled, setIsStreamingEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vibeStreamingEnabled");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vibeStreamingEnabled", String(isStreamingEnabled));
    }
  }, [isStreamingEnabled]);

  const startHandoff = (
    chatId: string,
    stream: ReadableStream<Uint8Array>,
    userMessage: string,
  ) => {
    setHandoff({ chatId, stream, userMessage });
  };

  const clearHandoff = () => {
    setHandoff({ chatId: null, stream: null, userMessage: null });
  };

  const toggleStreaming = () => {
    setIsStreamingEnabled((prev) => !prev);
  };

  return (
    <VibeStreamingContext.Provider
      value={{
        handoff,
        startHandoff,
        clearHandoff,
        isStreamingEnabled,
        toggleStreaming,
      }}
    >
      {children}
    </VibeStreamingContext.Provider>
  );
}
