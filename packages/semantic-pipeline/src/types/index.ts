/**
 * @fileoverview Type definitions for Semantic Web Development Pipeline
 * @module @repo/semantic-pipeline/types
 * @description
 * Core type definitions for the semantic pipeline system including
 * intent structures, node definitions, flow configurations, and output types.
 */

import { Node, Edge } from 'reactflow';

/**
 * User intent input structure
 */
export interface UserIntent {
  /** Raw user requirements and business goals */
  rawInput: string;
  /** Problem statement */
  problemStatement?: string;
  /** Target users/personas */
  targetUsers?: string[];
  /** Success metrics */
  successMetrics?: string[];
  /** Technical constraints */
  constraints?: TechnicalConstraints;
  /** Business context */
  businessContext?: BusinessContext;
}

/**
 * Technical constraints for the project
 */
export interface TechnicalConstraints {
  /** Performance requirements */
  performance?: 'critical' | 'high' | 'medium' | 'low';
  /** Scale requirements */
  scale?: string;
  /** Team familiarity with technologies */
  teamFamiliarity?: string[];
  /** Budget constraints */
  budget?: 'enterprise' | 'startup' | 'indie';
  /** Timeline */
  timeline?: string;
  /** Browser support */
  browserSupport?: string[];
}

/**
 * Business context information
 */
export interface BusinessContext {
  /** Industry */
  industry?: string;
  /** Company size */
  companySize?: string;
  /** Primary goals */
  primaryGoals?: string[];
  /** Competitive landscape */
  competitors?: string[];
}

/**
 * Parsed intent structure
 */
export interface ParsedIntent {
  /** Business goals extracted from intent */
  businessGoals: string[];
  /** User personas identified */
  userPersonas: UserPersona[];
  /** User journeys mapped */
  userJourneys: UserJourney[];
  /** Data entities required */
  dataEntities: DataEntity[];
  /** Technical constraints */
  technicalConstraints: TechnicalConstraints;
  /** Success metrics */
  successMetrics: string[];
}

/**
 * User persona definition
 */
export interface UserPersona {
  /** Persona name */
  name: string;
  /** Persona description */
  description: string;
  /** Key needs */
  needs: string[];
  /** Goals */
  goals: string[];
}

/**
 * User journey definition
 */
export interface UserJourney {
  /** Journey name */
  name: string;
  /** Steps in the journey */
  steps: JourneyStep[];
  /** Pain points */
  painPoints?: string[];
}

/**
 * Journey step
 */
export interface JourneyStep {
  /** Step name */
  name: string;
  /** Action taken */
  action: string;
  /** Expected outcome */
  outcome: string;
}

/**
 * Data entity definition
 */
export interface DataEntity {
  /** Entity name */
  name: string;
  /** Entity attributes */
  attributes: EntityAttribute[];
  /** Relationships to other entities */
  relationships?: EntityRelationship[];
}

/**
 * Entity attribute
 */
export interface EntityAttribute {
  /** Attribute name */
  name: string;
  /** Attribute type */
  type: string;
  /** Is required */
  required?: boolean;
  /** Default value */
  defaultValue?: unknown;
}

/**
 * Entity relationship
 */
export interface EntityRelationship {
  /** Related entity name */
  entity: string;
  /** Relationship type */
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  /** Relationship description */
  description?: string;
}

/**
 * Framework recommendation
 */
export interface FrameworkRecommendation {
  /** Framework name */
  framework: 'react' | 'vue' | 'angular' | 'svelte';
  /** Recommendation score */
  score: number;
  /** Reasons for recommendation */
  reasons: string[];
  /** Compatibility score */
  compatibility: number;
  /** Strengths */
  strengths: string[];
  /** Weaknesses */
  weaknesses: string[];
}

/**
 * Library recommendation
 */
export interface LibraryRecommendation {
  /** Category name */
  category: string;
  /** Primary recommendation */
  primary: LibraryOption;
  /** Alternative options */
  alternatives: LibraryOption[];
  /** Reasoning */
  reasoning: string;
}

/**
 * Library option
 */
export interface LibraryOption {
  /** Library name */
  name: string;
  /** Package name */
  package: string;
  /** Version */
  version?: string;
  /** Features */
  features: string[];
  /** Bundle size impact */
  bundleSize?: string;
}

/**
 * Architecture pattern
 */
export interface ArchitecturePattern {
  /** Pattern name */
  name: 'atomic-design' | 'feature-based' | 'layered';
  /** Structure definition */
  structure: string[];
  /** Best use cases */
  bestFor: string[];
  /** Generated folder structure */
  folderStructure?: FolderStructure;
}

/**
 * Folder structure definition
 */
export interface FolderStructure {
  /** Root directories */
  directories: DirectoryNode[];
  /** Configuration files */
  configs: ConfigFile[];
  /** Setup commands */
  setupCommands: SetupCommand[];
}

/**
 * Directory node
 */
export interface DirectoryNode {
  /** Directory name */
  name: string;
  /** Child directories */
  children?: DirectoryNode[];
  /** Files in directory */
  files?: string[];
}

/**
 * Configuration file
 */
export interface ConfigFile {
  /** File path */
  path: string;
  /** File content */
  content: string;
  /** File type */
  type: string;
}

/**
 * Setup command
 */
export interface SetupCommand {
  /** Command name */
  name: string;
  /** Command to run */
  command: string;
  /** Description */
  description: string;
}

/**
 * Generated component
 */
export interface GeneratedComponent {
  /** Component name */
  name: string;
  /** Component code */
  code: string;
  /** Component type */
  type: 'presentational' | 'container' | 'page';
  /** Props interface */
  props?: string;
  /** Dependencies */
  dependencies: string[];
  /** Test cases */
  testCases?: string[];
  /** Storybook stories */
  stories?: string;
}

/**
 * State management setup
 */
export interface StateManagementSetup {
  /** Selected library */
  library: string;
  /** Store structure */
  store: StoreStructure;
  /** Generated hooks */
  hooks: string[];
  /** Persistence configuration */
  persistence?: PersistenceConfig;
}

/**
 * Store structure
 */
export interface StoreStructure {
  /** Store slices */
  slices: StoreSlice[];
  /** Middleware */
  middleware: string[];
  /** Devtools configuration */
  devtools?: DevtoolsConfig;
}

/**
 * Store slice
 */
export interface StoreSlice {
  /** Slice name */
  name: string;
  /** Slice code */
  code: string;
  /** State shape */
  stateShape: Record<string, unknown>;
  /** Actions */
  actions: string[];
}

/**
 * Persistence configuration
 */
export interface PersistenceConfig {
  /** Enabled */
  enabled: boolean;
  /** Storage key */
  storageKey: string;
  /** Persisted state keys */
  persistedKeys: string[];
}

/**
 * Devtools configuration
 */
export interface DevtoolsConfig {
  /** Enabled */
  enabled: boolean;
  /** Devtools name */
  name: string;
}

/**
 * API layer configuration
 */
export interface APILayerConfig {
  /** Generated types */
  types: string;
  /** API client */
  client: string;
  /** React hooks */
  hooks: string[];
  /** Configuration */
  config: APIConfig;
}

/**
 * API configuration
 */
export interface APIConfig {
  /** Base URL */
  baseURL: string;
  /** Timeout */
  timeout: number;
  /** Retry configuration */
  retry?: RetryConfig;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Max retries */
  maxRetries: number;
  /** Retry delay */
  retryDelay: number;
}

/**
 * Design system configuration
 */
export interface DesignSystemConfig {
  /** Design tokens */
  tokens: DesignTokens;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Base components */
  components: GeneratedComponent[];
  /** Utility classes */
  utilities: string;
}

/**
 * Design tokens
 */
export interface DesignTokens {
  /** Colors */
  colors: ColorTokens;
  /** Spacing scale */
  spacing: SpacingTokens;
  /** Typography */
  typography: TypographyTokens;
  /** Shadows */
  shadows: ShadowTokens;
  /** Border radius */
  borderRadius: BorderRadiusTokens;
}

/**
 * Color tokens
 */
export interface ColorTokens {
  /** Primary colors */
  primary: ColorScale;
  /** Secondary colors */
  secondary: ColorScale;
  /** Semantic colors */
  semantic: SemanticColors;
}

/**
 * Color scale
 */
export interface ColorScale {
  /** Base color */
  DEFAULT: string;
  /** Lightest */
  50: string;
  /** Lighter */
  100: string;
  /** Light */
  200: string;
  /** Medium light */
  300: string;
  /** Medium */
  400: string;
  /** Medium dark */
  500: string;
  /** Dark */
  600: string;
  /** Darker */
  700: string;
  /** Darkest */
  800: string;
  /** Darkest */
  900: string;
}

/**
 * Semantic colors
 */
export interface SemanticColors {
  /** Success color */
  success: string;
  /** Warning color */
  warning: string;
  /** Error color */
  error: string;
  /** Info color */
  info: string;
}

/**
 * Spacing tokens
 */
export interface SpacingTokens {
  /** Base spacing unit */
  base: number;
  /** Spacing scale */
  scale: Record<string, number>;
}

/**
 * Typography tokens
 */
export interface TypographyTokens {
  /** Font families */
  fontFamilies: Record<string, string>;
  /** Font sizes */
  fontSizes: Record<string, string>;
  /** Font weights */
  fontWeights: Record<string, number>;
  /** Line heights */
  lineHeights: Record<string, number>;
}

/**
 * Shadow tokens
 */
export interface ShadowTokens {
  /** Shadow scale */
  scale: Record<string, string>;
}

/**
 * Border radius tokens
 */
export interface BorderRadiusTokens {
  /** Small radius */
  small: number;
  /** Medium radius */
  medium: number;
  /** Large radius */
  large: number;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Light theme */
  light: ThemeVariant;
  /** Dark theme */
  dark: ThemeVariant;
  /** High contrast theme */
  highContrast?: ThemeVariant;
}

/**
 * Theme variant
 */
export interface ThemeVariant {
  /** Theme name */
  name: string;
  /** Color overrides */
  colors?: Partial<ColorTokens>;
}

/**
 * Test strategy
 */
export interface TestStrategy {
  /** Test pyramid distribution */
  pyramid: TestPyramid;
  /** Tools configuration */
  tools: TestTools;
  /** Coverage rules */
  coverageRules: CoverageRule[];
  /** Generated test files */
  testFiles: TestFile[];
}

/**
 * Test pyramid
 */
export interface TestPyramid {
  /** Unit test percentage */
  unit: number;
  /** Integration test percentage */
  integration: number;
  /** E2E test percentage */
  e2e: number;
}

/**
 * Test tools
 */
export interface TestTools {
  /** Unit testing tool */
  unit: string;
  /** Integration testing tool */
  integration: string;
  /** E2E testing tool */
  e2e: string;
  /** Visual testing tool */
  visual?: string;
  /** Performance testing tool */
  performance?: string;
}

/**
 * Coverage rule
 */
export interface CoverageRule {
  /** Component type */
  componentType: string;
  /** Minimum coverage */
  minCoverage: number;
}

/**
 * Test file
 */
export interface TestFile {
  /** File path */
  path: string;
  /** Test code */
  code: string;
  /** Test type */
  type: 'unit' | 'integration' | 'e2e';
}

/**
 * Build optimization configuration
 */
export interface BuildOptimization {
  /** Optimizations applied */
  optimizations: Optimization[];
  /** Performance metrics */
  metrics: PerformanceMetrics;
  /** Generated configuration */
  config: string;
}

/**
 * Optimization
 */
export interface Optimization {
  /** Optimization type */
  type: string;
  /** Description */
  description: string;
  /** Impact */
  impact: string;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /** First Contentful Paint target */
  fcp: string;
  /** Largest Contentful Paint target */
  lcp: string;
  /** Cumulative Layout Shift target */
  cls: string;
  /** Total Blocking Time target */
  tbt: string;
  /** Bundle size target */
  bundleSize: string;
}

/**
 * Deployment configuration
 */
export interface DeploymentConfig {
  /** Provider */
  provider: 'vercel' | 'netlify' | 'aws-amplify' | 'cloudflare-pages' | 'self-hosted';
  /** Environment configurations */
  environments: EnvironmentConfig[];
  /** CI/CD pipeline */
  pipeline: PipelineConfig;
  /** Monitoring setup */
  monitoring: MonitoringConfig;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  /** Environment name */
  name: string;
  /** Configuration */
  config: Record<string, unknown>;
  /** Variables */
  variables: Record<string, string>;
}

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  /** Pipeline definition */
  definition: string;
  /** Steps */
  steps: PipelineStep[];
}

/**
 * Pipeline step
 */
export interface PipelineStep {
  /** Step name */
  name: string;
  /** Step type */
  type: 'test' | 'build' | 'deploy';
  /** Commands */
  commands: string[];
}

/**
 * Monitoring configuration
 */
export interface MonitoringConfig {
  /** Enabled */
  enabled: boolean;
  /** Tools */
  tools: string[];
  /** Metrics */
  metrics: string[];
}

/**
 * Pattern analysis result
 */
export interface PatternAnalysis {
  /** Success patterns */
  successPatterns: SuccessPattern[];
  /** Failure patterns */
  failurePatterns: FailurePattern[];
  /** Insights */
  insights: Insights;
  /** Recommendations */
  recommendations: string[];
}

/**
 * Success pattern
 */
export interface SuccessPattern {
  /** Pattern type */
  type: string;
  /** Pattern data */
  data: Record<string, unknown>;
  /** Success rate */
  successRate: number;
}

/**
 * Failure pattern
 */
export interface FailurePattern {
  /** Pattern type */
  type: string;
  /** Pattern data */
  data: Record<string, unknown>;
  /** Failure rate */
  failureRate: number;
}

/**
 * Insights
 */
export interface Insights {
  /** Top performing frameworks */
  topFrameworks: Array<{ framework: string; score: number }>;
  /** Optimal library combinations */
  optimalCombinations: Array<{ combination: string; score: number }>;
  /** Architecture success rates */
  architectureRates: Record<string, number>;
  /** Anti-patterns */
  antiPatterns: string[];
}

/**
 * Generated project output
 */
export interface GeneratedProject {
  /** Metadata */
  metadata: ProjectMetadata;
  /** Architecture */
  architecture: ArchitectureInfo;
  /** Components */
  components: ComponentInfo;
  /** Dependencies */
  dependencies: DependenciesInfo;
  /** Quality metrics */
  quality: QualityMetrics;
  /** Deployment info */
  deployment: DeploymentInfo;
  /** Learning data */
  learning: LearningData;
}

/**
 * Project metadata
 */
export interface ProjectMetadata {
  /** Generation timestamp */
  generatedAt: string;
  /** Generation ID */
  generationId: string;
  /** Intent hash */
  intentHash: string;
  /** Framework version */
  frameworkVersion: string;
  /** Total generation time */
  totalGenerationTime: number;
}

/**
 * Architecture information
 */
export interface ArchitectureInfo {
  /** Selected pattern */
  pattern: string;
  /** Rationale */
  rationale: string;
  /** Compliance scores */
  compliance: ComplianceScores;
}

/**
 * Compliance scores
 */
export interface ComplianceScores {
  /** Performance score */
  performance: number;
  /** Maintainability score */
  maintainability: number;
  /** Scalability score */
  scalability: number;
}

/**
 * Component information
 */
export interface ComponentInfo {
  /** Total components */
  total: number;
  /** Breakdown by type */
  byType: Record<string, number>;
  /** Accessibility score */
  accessibilityScore: number;
  /** Test coverage */
  testCoverage: number;
}

/**
 * Dependencies information
 */
export interface DependenciesInfo {
  /** Core dependencies */
  core: LibraryOption[];
  /** Dev dependencies */
  devDependencies: LibraryOption[];
  /** Peer dependencies */
  peerDependencies: LibraryOption[];
  /** Total bundle size */
  totalSize: string;
}

/**
 * Quality metrics
 */
export interface QualityMetrics {
  /** Lighthouse scores */
  lighthouse: LighthouseScores;
  /** Bundle analysis */
  bundleAnalysis: BundleMetrics;
  /** Test results */
  testResults: TestResults;
  /** Security audit */
  security: SecurityAudit;
}

/**
 * Lighthouse scores
 */
export interface LighthouseScores {
  /** Performance score */
  performance: number;
  /** Accessibility score */
  accessibility: number;
  /** Best practices score */
  bestPractices: number;
  /** SEO score */
  seo: number;
}

/**
 * Bundle metrics
 */
export interface BundleMetrics {
  /** Total size */
  totalSize: string;
  /** Initial bundle size */
  initialSize: string;
  /** Chunk breakdown */
  chunks: Array<{ name: string; size: string }>;
}

/**
 * Test results
 */
export interface TestResults {
  /** Total tests */
  total: number;
  /** Passed */
  passed: number;
  /** Failed */
  failed: number;
  /** Coverage */
  coverage: number;
}

/**
 * Security audit
 */
export interface SecurityAudit {
  /** Vulnerabilities */
  vulnerabilities: number;
  /** High severity */
  high: number;
  /** Medium severity */
  medium: number;
  /** Low severity */
  low: number;
}

/**
 * Deployment information
 */
export interface DeploymentInfo {
  /** Deployed environments */
  environments: string[];
  /** URLs */
  urls: Record<string, string>;
  /** Monitoring setup */
  monitoring: boolean;
  /** Backup strategy */
  backup: string;
}

/**
 * Learning data
 */
export interface LearningData {
  /** Patterns applied */
  patternsApplied: string[];
  /** Decision log */
  decisions: DecisionLog[];
  /** Improvements suggested */
  improvements: string[];
  /** Future recommendations */
  nextRecommendations: string[];
}

/**
 * Decision log entry
 */
export interface DecisionLog {
  /** Decision point */
  point: string;
  /** Decision made */
  decision: string;
  /** Rationale */
  rationale: string;
  /** Alternatives considered */
  alternatives: string[];
  /** Timestamp */
  timestamp: string;
}

/**
 * React Flow node data
 */
export interface PipelineNodeData {
  /** Node label */
  label: string;
  /** Node description */
  description?: string;
  /** Node type specific data */
  [key: string]: unknown;
}

/**
 * Pipeline node
 */
export type PipelineNode = Node<PipelineNodeData>;

/**
 * Pipeline edge
 */
export type PipelineEdge = Edge;

/**
 * Flow configuration
 */
export interface FlowConfig {
  /** Flow name */
  flowName: string;
  /** Version */
  version: string;
  /** Description */
  description: string;
  /** Total nodes */
  totalNodes: number;
  /** Total edges */
  totalEdges: number;
  /** Sections */
  sections: string[];
  /** Nodes */
  nodes: PipelineNode[];
  /** Edges */
  edges: PipelineEdge[];
}

