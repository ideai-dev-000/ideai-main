/**
 * @fileoverview Semantic Web Development Pipeline - Main Entry Point
 * @module @repo/semantic-pipeline
 * @description
 * AI-driven semantic web development pipeline that transforms user intent
 * into production-ready web applications with pattern learning and quality guarantees.
 * 
 * @example
 * ```typescript
 * import { SemanticPipeline } from '@repo/semantic-pipeline';
 * 
 * const pipeline = new SemanticPipeline();
 * const result = await pipeline.generate({
 *   intent: "Build a SaaS dashboard for e-commerce analytics",
 *   constraints: { performance: "critical", scale: "10k users" }
 * });
 * ```
 * 
 * @see {@link ./flow} - React Flow visualization components
 * @see {@link ./engine} - Core semantic engine and processors
 * @see {@link ./generators} - Code generation modules
 */

export * from './types';
export * from './engine';
export * from './generators';
export * from './flow';
export * from './pipeline';

