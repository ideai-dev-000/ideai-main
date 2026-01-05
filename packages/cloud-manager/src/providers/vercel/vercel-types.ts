/**
 * @fileoverview Vercel Provider Types
 *
 * @module VercelTypes
 * @description
 * TypeScript type definitions for Vercel API and configuration.
 */

/**
 * Vercel project configuration
 */
export interface VercelProjectConfig {
  /** Project name */
  name: string;
  /** Project ID */
  id?: string;
  /** Organization ID */
  orgId: string;
  /** Root directory (relative to repo root) */
  rootDirectory?: string;
  /** Build command */
  buildCommand?: string;
  /** Install command */
  installCommand?: string;
  /** Output directory */
  outputDirectory?: string;
  /** Framework preset */
  framework?: string;
  /** Include files outside root directory */
  includeFilesOutsideRoot?: boolean;
  /** Environment variables */
  env?: Record<string, string>;
  /** Domains */
  domains?: string[];
  /** Subdomain configuration */
  subdomain?: string;
}

/**
 * Vercel deployment status
 */
export interface VercelDeployment {
  id: string;
  url: string;
  state: "BUILDING" | "READY" | "ERROR" | "CANCELED";
  createdAt: number;
  updatedAt: number;
}

/**
 * Vercel project settings
 */
export interface VercelProjectSettings {
  rootDirectory: string | null;
  buildCommand: string | null;
  installCommand: string | null;
  outputDirectory: string | null;
  framework: string | null;
  includeFilesOutsideRoot: boolean;
}

/**
 * Vercel API response wrapper
 */
export interface VercelApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
