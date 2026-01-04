/**
 * @fileoverview Semantic Knowledge Graph Builder
 * @module @repo/semantic-pipeline/engine/semantic-graph-builder
 * @description
 * Builds interconnected semantic understanding of the project.
 * Creates a knowledge graph that tracks concepts, features, constraints,
 * and relationships across the development pipeline.
 */

import type { ParsedIntent } from '../types';

/**
 * Semantic Knowledge Graph Builder
 * 
 * Creates a graph structure to track semantic relationships
 * and enable pattern matching across projects.
 */
export class SemanticGraphBuilder {
  private graph: Map<string, SemanticNode> = new Map();
  
  /**
   * Add semantic node to graph
   */
  async addSemanticNode(
    intentComponent: IntentComponent,
    embedding?: number[]
  ): Promise<{ node: SemanticNode; similarNodes: SemanticNode[] }> {
    const node: SemanticNode = {
      id: this.generateNodeId(intentComponent),
      type: intentComponent.type,
      name: intentComponent.name,
      description: intentComponent.description,
      embedding: embedding || [],
      metadata: intentComponent.metadata || {},
      relationships: [],
    };
    
    this.graph.set(node.id, node);
    
    // Find similar nodes
    const similarNodes = this.findSimilarNodes(node);
    
    return { node, similarNodes };
  }
  
  /**
   * Build graph from parsed intent
   */
  async buildFromIntent(parsedIntent: ParsedIntent): Promise<SemanticGraph> {
    const nodes: SemanticNode[] = [];
    
    // Add business goals as concepts
    for (const goal of parsedIntent.businessGoals) {
      const { node } = await this.addSemanticNode({
        type: 'Concept',
        name: goal,
        description: `Business goal: ${goal}`,
        metadata: { category: 'business-goal' },
      });
      nodes.push(node);
    }
    
    // Add user personas
    for (const persona of parsedIntent.userPersonas) {
      const { node } = await this.addSemanticNode({
        type: 'Persona',
        name: persona.name,
        description: persona.description,
        metadata: { needs: persona.needs, goals: persona.goals },
      });
      nodes.push(node);
    }
    
    // Add data entities
    for (const entity of parsedIntent.dataEntities) {
      const { node } = await this.addSemanticNode({
        type: 'DataEntity',
        name: entity.name,
        description: `Data entity: ${entity.name}`,
        metadata: { attributes: entity.attributes },
      });
      nodes.push(node);
    }
    
    // Add constraints
    if (parsedIntent.technicalConstraints) {
      const constraints = Object.entries(parsedIntent.technicalConstraints)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => ({
          type: 'Constraint' as const,
          name: key,
          description: `${key}: ${value}`,
          metadata: { value },
        }));
      
      for (const constraint of constraints) {
        const { node } = await this.addSemanticNode(constraint);
        nodes.push(node);
      }
    }
    
    // Build relationships
    this.buildRelationships(nodes);
    
    return {
      nodes,
      edges: this.extractEdges(),
    };
  }
  
  /**
   * Find similar nodes using semantic similarity
   */
  private findSimilarNodes(node: SemanticNode): SemanticNode[] {
    const similar: SemanticNode[] = [];
    
    for (const [, otherNode] of this.graph) {
      if (otherNode.id === node.id) continue;
      
      // Simple similarity based on type and name
      if (otherNode.type === node.type) {
        const nameSimilarity = this.calculateNameSimilarity(node.name, otherNode.name);
        if (nameSimilarity > 0.7) {
          similar.push(otherNode);
        }
      }
    }
    
    return similar;
  }
  
  /**
   * Calculate name similarity (simple Jaccard)
   */
  private calculateNameSimilarity(name1: string, name2: string): number {
    const words1 = new Set(name1.toLowerCase().split(/\s+/));
    const words2 = new Set(name2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
  
  /**
   * Build relationships between nodes
   */
  private buildRelationships(nodes: SemanticNode[]): void {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];
        
        if (!node1 || !node2) continue;
        
        const relationship = this.determineRelationship(node1, node2);
        if (relationship) {
          node1.relationships.push({
            target: node2.id,
            type: relationship,
          });
        }
      }
    }
  }
  
  /**
   * Determine relationship type between two nodes
   */
  private determineRelationship(
    node1: SemanticNode,
    node2: SemanticNode
  ): 'requires' | 'conflicts-with' | 'enhances' | 'depends-on' | 'similar-to' | null {
    // Concept -> Persona: enhances
    if (node1.type === 'Concept' && node2.type === 'Persona') {
      return 'enhances';
    }
    
    // DataEntity -> Concept: requires
    if (node1.type === 'DataEntity' && node2.type === 'Concept') {
      return 'requires';
    }
    
    // Similar nodes
    if (node1.type === node2.type) {
      return 'similar-to';
    }
    
    return null;
  }
  
  /**
   * Extract edges from graph
   */
  private extractEdges(): SemanticEdge[] {
    const edges: SemanticEdge[] = [];
    
    for (const [, node] of this.graph) {
      for (const relationship of node.relationships) {
        edges.push({
          source: node.id,
          target: relationship.target,
          type: relationship.type,
        });
      }
    }
    
    return edges;
  }
  
  /**
   * Generate unique node ID
   */
  private generateNodeId(component: IntentComponent): string {
    return `${component.type.toLowerCase()}-${component.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  }
  
  /**
   * Get graph structure
   */
  getGraph(): SemanticGraph {
    return {
      nodes: Array.from(this.graph.values()),
      edges: this.extractEdges(),
    };
  }
}

/**
 * Intent component structure
 */
interface IntentComponent {
  type: 'Concept' | 'Feature' | 'Constraint' | 'Persona' | 'DataEntity';
  name: string;
  description: string;
  metadata?: Record<string, unknown>;
}

/**
 * Semantic node structure
 */
interface SemanticNode {
  id: string;
  type: string;
  name: string;
  description: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  relationships: Array<{ target: string; type: string }>;
}

/**
 * Semantic edge structure
 */
interface SemanticEdge {
  source: string;
  target: string;
  type: string;
}

/**
 * Semantic graph structure
 */
interface SemanticGraph {
  nodes: SemanticNode[];
  edges: SemanticEdge[];
}

