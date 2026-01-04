/**
 * @fileoverview Flow Configuration
 * @module @repo/semantic-pipeline/flow/flow-config
 * @description
 * Default React Flow configuration for the semantic pipeline.
 */

import type { FlowConfig, PipelineNode, PipelineEdge } from '../types';

/**
 * Default flow configuration
 */
export const defaultFlowConfig: FlowConfig = {
  flowName: 'SemanticWebDevelopmentPipeline',
  version: '2.0',
  description: 'End-to-end AI-driven web development with semantic intent tracking',
  totalNodes: 15,
  totalEdges: 20,
  sections: [
    'Intent Analysis',
    'Framework Selection',
    'Component Architecture',
    'Implementation',
    'Quality Assurance',
    'Deployment',
    'Learning & Feedback',
  ],
  nodes: [],
  edges: [],
};

/**
 * Create flow nodes from configuration
 */
export function createFlowNodes(): PipelineNode[] {
  return [
    {
      id: 'intent-input',
      type: 'input',
      position: { x: 50, y: 50 },
      data: {
        label: '🎯 User Intent Input',
        description: 'Raw user requirements and business goals',
      },
    },
    {
      id: 'intent-parser',
      type: 'default',
      position: { x: 400, y: 50 },
      data: {
        label: '🔍 Semantic Intent Parser',
        description: 'LLM-powered intent decomposition',
      },
    },
    {
      id: 'semantic-graph',
      type: 'default',
      position: { x: 800, y: 50 },
      data: {
        label: '🧠 Semantic Knowledge Graph',
        description: 'Builds interconnected understanding',
      },
    },
    {
      id: 'framework-analyzer',
      type: 'default',
      position: { x: 50, y: 200 },
      data: {
        label: '🏗️ Framework Analyzer',
        description: 'Analyzes framework compatibility',
      },
    },
    {
      id: 'library-selector',
      type: 'default',
      position: { x: 400, y: 200 },
      data: {
        label: '📚 Library Selector',
        description: 'Chooses optimal libraries',
      },
    },
    {
      id: 'architecture-generator',
      type: 'default',
      position: { x: 800, y: 200 },
      data: {
        label: '🏛️ Architecture Generator',
        description: 'Creates folder structure',
      },
    },
    {
      id: 'component-generator',
      type: 'default',
      position: { x: 50, y: 400 },
      data: {
        label: '⚛️ Component Generator',
        description: 'Generates React components',
      },
    },
    {
      id: 'state-management',
      type: 'default',
      position: { x: 400, y: 400 },
      data: {
        label: '🔄 State Management',
        description: 'Sets up state management',
      },
    },
    {
      id: 'api-layer',
      type: 'default',
      position: { x: 800, y: 400 },
      data: {
        label: '🔌 API Layer',
        description: 'Generates API client',
      },
    },
    {
      id: 'design-system',
      type: 'default',
      position: { x: 50, y: 600 },
      data: {
        label: '🎨 Design System',
        description: 'Creates design tokens',
      },
    },
    {
      id: 'test-strategy',
      type: 'default',
      position: { x: 400, y: 600 },
      data: {
        label: '🧪 Test Strategy',
        description: 'Generates test plans',
      },
    },
    {
      id: 'build-optimizer',
      type: 'default',
      position: { x: 800, y: 600 },
      data: {
        label: '⚡ Build Optimizer',
        description: 'Optimizes bundle size',
      },
    },
    {
      id: 'deployment',
      type: 'default',
      position: { x: 400, y: 800 },
      data: {
        label: '🚀 Deployment',
        description: 'Configures CI/CD',
      },
    },
    {
      id: 'pattern-analyzer',
      type: 'default',
      position: { x: 800, y: 800 },
      data: {
        label: '📊 Pattern Analyzer',
        description: 'Learns from outcomes',
      },
    },
    {
      id: 'final-output',
      type: 'output',
      position: { x: 1200, y: 450 },
      data: {
        label: '🚀 Agentic Website',
        description: 'Complete, optimized website',
      },
    },
  ];
}

/**
 * Create flow edges
 */
export function createFlowEdges(): PipelineEdge[] {
  return [
    { id: 'e1', source: 'intent-input', target: 'intent-parser' },
    { id: 'e2', source: 'intent-parser', target: 'semantic-graph' },
    { id: 'e3', source: 'semantic-graph', target: 'framework-analyzer' },
    { id: 'e4', source: 'framework-analyzer', target: 'library-selector' },
    { id: 'e5', source: 'library-selector', target: 'architecture-generator' },
    { id: 'e6', source: 'architecture-generator', target: 'component-generator' },
    { id: 'e7', source: 'component-generator', target: 'state-management' },
    { id: 'e8', source: 'state-management', target: 'api-layer' },
    { id: 'e9', source: 'api-layer', target: 'design-system' },
    { id: 'e10', source: 'design-system', target: 'test-strategy' },
    { id: 'e11', source: 'test-strategy', target: 'build-optimizer' },
    { id: 'e12', source: 'build-optimizer', target: 'deployment' },
    { id: 'e13', source: 'deployment', target: 'pattern-analyzer' },
    { id: 'e14', source: 'pattern-analyzer', target: 'framework-analyzer', animated: true },
    { id: 'e15', source: 'component-generator', target: 'final-output' },
    { id: 'e16', source: 'test-strategy', target: 'final-output' },
    { id: 'e17', source: 'deployment', target: 'final-output' },
    { id: 'e18', source: 'pattern-analyzer', target: 'final-output' },
  ];
}

