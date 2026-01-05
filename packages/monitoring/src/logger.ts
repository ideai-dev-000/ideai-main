/**
 * Structured Logging Utilities
 * Production-ready logging with context
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString(),
    })
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatLog({ level: "debug", message, timestamp: new Date().toISOString(), context }))
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatLog({ level: "info", message, timestamp: new Date().toISOString(), context }))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog({ level: "warn", message, timestamp: new Date().toISOString(), context }))
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatLog({ level: "error", message, timestamp: new Date().toISOString(), context }))
  }
}

export const logger = new Logger()
