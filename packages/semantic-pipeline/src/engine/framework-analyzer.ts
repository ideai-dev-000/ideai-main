/**
 * @fileoverview Framework Compatibility Analyzer
 * @module @repo/semantic-pipeline/engine/framework-analyzer
 * @description
 * Analyzes requirements against framework capabilities and recommends
 * optimal framework based on project constraints and team familiarity.
 * 
 * @example
 * ```typescript
 * const analyzer = new FrameworkAnalyzer();
 * const recommendations = await analyzer.recommendFramework(
 *   parsedIntent,
 *   constraints
 * );
 * ```
 */

import type {
  ParsedIntent,
  TechnicalConstraints,
  FrameworkRecommendation,
} from '../types';

/**
 * Framework compatibility matrix and analyzer
 */
export class FrameworkAnalyzer {
  private frameworks = {
    react: {
      strengths: ['ecosystem', 'component-reusability', 'developer-availability'],
      weaknesses: ['bundle-size', 'boilerplate'],
      idealFor: ['SPAs', 'dashboards', 'complex-UIs'],
      libraries: ['nextjs', 'remix', 'gatsby', 'vite'],
    },
    vue: {
      strengths: ['progressive', 'documentation', 'performance'],
      weaknesses: ['enterprise-adoption', 'typescript-support'],
      idealFor: ['prototypes', 'progressive-enhancement', 'single-page-apps'],
    },
    angular: {
      strengths: ['batteries-included', 'enterprise', 'typescript'],
      weaknesses: ['learning-curve', 'bundle-size'],
      idealFor: ['large-teams', 'enterprise-apps', 'long-term-maintenance'],
    },
    svelte: {
      strengths: ['performance', 'bundle-size', 'developer-experience'],
      weaknesses: ['ecosystem', 'enterprise-tooling'],
      idealFor: ['performance-critical', 'small-teams', 'embedded-devices'],
    },
  } as const;
  
  /**
   * Recommend framework based on requirements and constraints
   */
  async recommendFramework(
    requirements: ParsedIntent,
    constraints: TechnicalConstraints
  ): Promise<FrameworkRecommendation[]> {
    const scores: Record<string, FrameworkScore> = {};
    
    for (const [framework, data] of Object.entries(this.frameworks)) {
      let score = 0;
      const reasons: string[] = [];
      
      // Match against requirements
      for (const goal of requirements.businessGoals) {
        const goalLower = goal.toLowerCase();
        
        // Dashboard/analytics apps favor React
        if (goalLower.includes('dashboard') || goalLower.includes('analytics')) {
          if (framework === 'react') {
            score += 3;
            reasons.push('Excellent ecosystem for dashboards and analytics');
          }
        }
        
        // Performance-critical favors Svelte
        if (constraints.performance === 'critical') {
          if (framework === 'svelte') {
            score += 2;
            reasons.push('Optimal for performance-critical applications');
          }
        }
        
        // Enterprise apps favor Angular
        if (goalLower.includes('enterprise') || constraints.budget === 'enterprise') {
          if (framework === 'angular') {
            score += 3;
            reasons.push('Strong enterprise support and tooling');
          }
        }
      }
      
      // Check constraints
      const strengthsArray = Array.from(data.strengths);
      if (constraints.performance === 'critical' && strengthsArray.includes('performance')) {
        score += 2;
        reasons.push('Performance is a key strength');
      }
      
      // Team familiarity bonus (highest weight)
      if (constraints.teamFamiliarity?.includes(framework)) {
        score += 4;
        reasons.push('Team has existing expertise');
      }
      
      // Scale considerations
      if (constraints.scale) {
        const scaleNum = this.parseScale(constraints.scale);
        if (scaleNum > 10000 && framework === 'react') {
          score += 1;
          reasons.push('Proven at scale');
        }
      }
      
      // Ecosystem strength
      if (strengthsArray.includes('ecosystem')) {
        score += 1;
        reasons.push('Rich ecosystem and community');
      }
      
      // Calculate compatibility
      const compatibility = this.calculateCompatibility(framework, requirements, constraints);
      
      scores[framework] = {
        score,
        reasons,
        compatibility,
        strengths: strengthsArray,
        weaknesses: Array.from(data.weaknesses),
      };
    }
    
    // Sort by score and return recommendations
    return Object.entries(scores)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([framework, data]) => ({
        framework: framework as FrameworkRecommendation['framework'],
        score: data.score,
        reasons: data.reasons,
        compatibility: data.compatibility,
        strengths: Array.from(data.strengths),
        weaknesses: Array.from(data.weaknesses),
      }));
  }
  
  /**
   * Parse scale string to number
   */
  private parseScale(scale: string | undefined): number {
    if (!scale) return 0;
    const match = scale.match(/(\d+)([kKmM])?/);
    if (!match) return 0;
    
    const num = parseInt(match[1] || '0', 10);
    const unit = match[2]?.toLowerCase();
    
    if (unit === 'k') return num * 1000;
    if (unit === 'm') return num * 1000000;
    
    return num;
  }
  
  /**
   * Calculate compatibility score (0-100)
   */
  private calculateCompatibility(
    framework: string,
    requirements: ParsedIntent,
    constraints: TechnicalConstraints
  ): number {
    let compatibility = 50; // Base score
    
    const frameworkData = this.frameworks[framework as keyof typeof this.frameworks];
    
    // Check if framework is ideal for any requirement categories
    for (const goal of requirements.businessGoals) {
      const goalLower = goal.toLowerCase();
      
      for (const ideal of frameworkData.idealFor) {
        if (goalLower.includes(ideal.toLowerCase())) {
          compatibility += 10;
        }
      }
    }
    
    // Performance match
    const strengthsArray = Array.from(frameworkData.strengths);
    if (constraints.performance === 'critical' && strengthsArray.includes('performance')) {
      compatibility += 15;
    }
    
    // Team familiarity
    if (constraints.teamFamiliarity?.includes(framework)) {
      compatibility += 20;
    }
    
    // Cap at 100
    return Math.min(100, compatibility);
  }
  
  /**
   * Generate reasoning for framework selection
   */
  generateReasoning(
    framework: string,
    requirements: ParsedIntent,
    constraints: TechnicalConstraints
  ): string {
    const frameworkData = this.frameworks[framework as keyof typeof this.frameworks];
    
    const reasons: string[] = [];
    
    reasons.push(`${framework.toUpperCase()} is recommended because:`);
    reasons.push(`- Strengths: ${Array.from(frameworkData.strengths).join(', ')}`);
    reasons.push(`- Ideal for: ${Array.from(frameworkData.idealFor).join(', ')}`);
    
    if (constraints.teamFamiliarity?.includes(framework)) {
      reasons.push(`- Team has existing expertise`);
    }
    
    return reasons.join('\n');
  }
}

/**
 * Internal framework score structure
 */
interface FrameworkScore {
  score: number;
  reasons: string[];
  compatibility: number;
  strengths: readonly string[];
  weaknesses: readonly string[];
}

