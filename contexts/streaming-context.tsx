'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface StreamingHandoff {
  chatId: string | null
  stream: ReadableStream<Uint8Array> | null
  userMessage: string | null
}

interface StreamingContextType {
  handoff: StreamingHandoff
  startHandoff: (
    chatId: string,
    stream: ReadableStream<Uint8Array>,
    userMessage: string,
  ) => void
  clearHandoff: () => void
  // Streaming toggle state
  isStreamingEnabled: boolean
  toggleStreaming: () => void
}

const StreamingContext = createContext<StreamingContextType | null>(null)

export function useStreaming() {
  const context = useContext(StreamingContext)
  if (!context) {
    throw new Error('useStreaming must be used within a StreamingProvider')
  }
  return context
}

interface StreamingProviderProps {
  children: ReactNode
}

export function StreamingProvider({ children }: StreamingProviderProps) {
  const [handoff, setHandoff] = useState<StreamingHandoff>({
    chatId: null,
    stream: null,
    userMessage: null,
  })

  // Streaming toggle state - default to true, persist in localStorage
  const [isStreamingEnabled, setIsStreamingEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('streamingEnabled')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('streamingEnabled', String(isStreamingEnabled))
    }
  }, [isStreamingEnabled])

  const startHandoff = (
    chatId: string,
    stream: ReadableStream<Uint8Array>,
    userMessage: string,
  ) => {
    setHandoff({ chatId, stream, userMessage })
  }

  const clearHandoff = () => {
    setHandoff({ chatId: null, stream: null, userMessage: null })
  }

  const toggleStreaming = () => {
    setIsStreamingEnabled((prev) => !prev)
  }

  return (
    <StreamingContext.Provider
      value={{
        handoff,
        startHandoff,
        clearHandoff,
        isStreamingEnabled,
        toggleStreaming,
      }}
    >
      {children}
    </StreamingContext.Provider>
  )
}
