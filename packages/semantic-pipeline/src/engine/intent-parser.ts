/**
 * @fileoverview Semantic Intent Parser
 * @module @repo/semantic-pipeline/engine/intent-parser
 * @description
 * LLM-powered intent decomposition into structured components.
 * Parses raw user requirements into business goals, user personas,
 * data entities, and technical constraints.
 * 
 * @example
 * ```typescript
 * const parser = new IntentParser();
 * const parsed = await parser.parseIntent({
 *   rawInput: "Build a SaaS dashboard for e-commerce analytics"
 * });
 * ```
 */

import type {
  UserIntent,
  ParsedIntent,
  UserPersona,
  UserJourney,
  DataEntity,
} from '../types';

/**
 * Semantic Intent Parser
 * 
 * Decomposes user requirements into structured components using
 * semantic analysis and pattern matching.
 */
export class IntentParser {
  /**
   * Parse user intent into structured components
   * 
   * @param intent - Raw user intent input
   * @returns Parsed intent with structured components
   */
  async parseIntent(intent: UserIntent): Promise<ParsedIntent> {
    // Extract business goals
    const businessGoals = this.extractBusinessGoals(intent.rawInput);
    
    // Identify user personas
    const userPersonas = this.identifyUserPersonas(intent.rawInput, intent.targetUsers);
    
    // Map user journeys
    const userJourneys = this.mapUserJourneys(intent.rawInput, userPersonas);
    
    // Extract data entities
    const dataEntities = this.extractDataEntities(intent.rawInput);
    
    // Parse technical constraints
    const technicalConstraints = this.parseTechnicalConstraints(
      intent.rawInput,
      intent.constraints
    );
    
    // Extract success metrics
    const successMetrics = this.extractSuccessMetrics(
      intent.rawInput,
      intent.successMetrics
    );
    
    return {
      businessGoals,
      userPersonas,
      userJourneys,
      dataEntities,
      technicalConstraints: technicalConstraints || {},
      successMetrics,
    };
  }
  
  /**
   * Extract business goals from raw input
   */
  private extractBusinessGoals(rawInput: string): string[] {
    const goals: string[] = [];
    
    // Pattern matching for common goal indicators
    const goalPatterns = [
      /build\s+(?:a|an)\s+([^,\.]+)/gi,
      /create\s+(?:a|an)\s+([^,\.]+)/gi,
      /develop\s+(?:a|an)\s+([^,\.]+)/gi,
      /goal[:\s]+([^\.]+)/gi,
      /objective[:\s]+([^\.]+)/gi,
    ];
    
    for (const pattern of goalPatterns) {
      const matches = rawInput.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          goals.push(match[1].trim());
        }
      }
    }
    
    // If no patterns found, use the first sentence as primary goal
    if (goals.length === 0) {
      const firstSentence = rawInput.split(/[\.!?]/)[0]?.trim();
      if (firstSentence) {
        goals.push(firstSentence);
      }
    }
    
    return goals.length > 0 ? goals : ['Build web application'];
  }
  
  /**
   * Identify user personas from input
   */
  private identifyUserPersonas(
    rawInput: string,
    targetUsers?: string[]
  ): UserPersona[] {
    const personas: UserPersona[] = [];
    
    // Use provided target users if available
    if (targetUsers && targetUsers.length > 0) {
      for (const user of targetUsers) {
        personas.push({
          name: user,
          description: `User who needs ${user}`,
          needs: this.extractNeeds(rawInput, user),
          goals: this.extractGoals(rawInput, user),
        });
      }
    } else {
      // Extract from input
      const userPatterns = [
        /(?:for|targeting|serving)\s+([^,\.]+)\s+(?:users|customers|clients)/gi,
        /(?:end\s+)?users?\s+(?:are|include|like)\s+([^,\.]+)/gi,
      ];
      
      for (const pattern of userPatterns) {
        const matches = rawInput.matchAll(pattern);
        for (const match of matches) {
          if (match[1]) {
            const userType = match[1].trim();
            personas.push({
              name: userType,
              description: `User type: ${userType}`,
              needs: this.extractNeeds(rawInput, userType),
              goals: this.extractGoals(rawInput, userType),
            });
          }
        }
      }
    }
    
    // Default persona if none found
    if (personas.length === 0) {
      personas.push({
        name: 'End User',
        description: 'Primary application user',
        needs: ['Easy to use', 'Fast performance'],
        goals: ['Complete tasks efficiently'],
      });
    }
    
    return personas;
  }
  
  /**
   * Extract needs for a user type
   */
  private extractNeeds(rawInput: string, userType: string): string[] {
    // Simple extraction - can be enhanced with LLM
    const needs: string[] = [];
    
    if (rawInput.toLowerCase().includes('analytics')) {
      needs.push('View data and insights');
    }
    if (rawInput.toLowerCase().includes('dashboard')) {
      needs.push('Monitor key metrics');
    }
    if (rawInput.toLowerCase().includes('real-time')) {
      needs.push('Real-time updates');
    }
    
    return needs.length > 0 ? needs : ['Access to application features'];
  }
  
  /**
   * Extract goals for a user type
   */
  private extractGoals(rawInput: string, userType: string): string[] {
    const goals: string[] = [];
    
    if (rawInput.toLowerCase().includes('analytics')) {
      goals.push('Understand data trends');
    }
    if (rawInput.toLowerCase().includes('dashboard')) {
      goals.push('Track performance metrics');
    }
    
    return goals.length > 0 ? goals : ['Complete tasks successfully'];
  }
  
  /**
   * Map user journeys from input
   */
  private mapUserJourneys(
    rawInput: string,
    personas: UserPersona[]
  ): UserJourney[] {
    const journeys: UserJourney[] = [];
    
    // Extract journey keywords
    const journeyKeywords = [
      'login',
      'signup',
      'dashboard',
      'analytics',
      'report',
      'settings',
      'profile',
    ];
    
    for (const keyword of journeyKeywords) {
      if (rawInput.toLowerCase().includes(keyword)) {
        journeys.push({
          name: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Journey`,
          steps: [
            {
              name: `Access ${keyword}`,
              action: `Navigate to ${keyword}`,
              outcome: `View ${keyword} content`,
            },
          ],
        });
      }
    }
    
    // Default journey if none found
    if (journeys.length === 0) {
      journeys.push({
        name: 'Main User Journey',
        steps: [
          {
            name: 'Access Application',
            action: 'Open application',
            outcome: 'View main interface',
          },
        ],
      });
    }
    
    return journeys;
  }
  
  /**
   * Extract data entities from input
   */
  private extractDataEntities(rawInput: string): DataEntity[] {
    const entities: DataEntity[] = [];
    
    // Common entity patterns
    const entityPatterns = [
      { pattern: /(?:user|users|customer|customers)/gi, name: 'User' },
      { pattern: /(?:product|products|item|items)/gi, name: 'Product' },
      { pattern: /(?:order|orders|transaction|transactions)/gi, name: 'Order' },
      { pattern: /(?:analytics|data|metrics|reports)/gi, name: 'Analytics' },
    ];
    
    for (const { pattern, name } of entityPatterns) {
      if (pattern.test(rawInput)) {
        entities.push({
          name,
          attributes: this.generateDefaultAttributes(name),
          relationships: [],
        });
      }
    }
    
    // Default entity if none found
    if (entities.length === 0) {
      entities.push({
        name: 'Data',
        attributes: [
          { name: 'id', type: 'string', required: true },
          { name: 'createdAt', type: 'date', required: true },
        ],
      });
    }
    
    return entities;
  }
  
  /**
   * Generate default attributes for an entity
   */
  private generateDefaultAttributes(entityName: string): Array<{
    name: string;
    type: string;
    required?: boolean;
  }> {
    const baseAttributes = [
      { name: 'id', type: 'string', required: true },
      { name: 'createdAt', type: 'date', required: true },
      { name: 'updatedAt', type: 'date', required: true },
    ];
    
    // Entity-specific attributes
    const specificAttributes: Record<string, Array<{ name: string; type: string }>> = {
      User: [
        { name: 'email', type: 'string' },
        { name: 'name', type: 'string' },
      ],
      Product: [
        { name: 'name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'description', type: 'string' },
      ],
      Order: [
        { name: 'userId', type: 'string' },
        { name: 'productId', type: 'string' },
        { name: 'total', type: 'number' },
      ],
    };
    
    return [
      ...baseAttributes,
      ...(specificAttributes[entityName] || []),
    ];
  }
  
  /**
   * Parse technical constraints
   */
  private parseTechnicalConstraints(
    rawInput: string,
    providedConstraints?: UserIntent['constraints']
  ): UserIntent['constraints'] {
    const constraints: UserIntent['constraints'] = providedConstraints || {};
    
    // Extract performance requirements
    if (!constraints.performance) {
      if (rawInput.match(/(?:high|critical|fast|performance)/i)) {
        constraints.performance = 'critical';
      } else if (rawInput.match(/(?:medium|moderate)/i)) {
        constraints.performance = 'medium';
      } else {
        constraints.performance = 'high';
      }
    }
    
    // Extract scale requirements
    if (!constraints.scale) {
      const scaleMatch = rawInput.match(/(\d+[kKmM]?)\s*(?:users|concurrent|requests)/i);
      if (scaleMatch) {
        constraints.scale = scaleMatch[1];
      }
    }
    
    return constraints;
  }
  
  /**
   * Extract success metrics
   */
  private extractSuccessMetrics(
    rawInput: string,
    providedMetrics?: string[]
  ): string[] {
    if (providedMetrics && providedMetrics.length > 0) {
      return providedMetrics;
    }
    
    const metrics: string[] = [];
    
    // Common success indicators
    if (rawInput.toLowerCase().includes('performance')) {
      metrics.push('Page load time < 2s');
    }
    if (rawInput.toLowerCase().includes('users')) {
      metrics.push('User satisfaction score > 4.0');
    }
    if (rawInput.toLowerCase().includes('analytics')) {
      metrics.push('Data accuracy > 99%');
    }
    
    return metrics.length > 0 ? metrics : ['User engagement', 'Performance metrics'];
  }
}

