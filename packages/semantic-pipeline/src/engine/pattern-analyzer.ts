/**
 * @fileoverview Pattern Analyzer & Feedback Loop
 * @module @repo/semantic-pipeline/engine/pattern-analyzer
 * @description
 * Analyzes project success patterns and improves future recommendations.
 * Tracks outcomes and updates knowledge base for continuous learning.
 */

import type {
  GeneratedProject,
  PatternAnalysis,
  SuccessPattern,
  FailurePattern,
  Insights,
} from '../types';

/**
 * Pattern Analyzer
 * 
 * Analyzes project outcomes and extracts patterns for future improvements.
 */
export class PatternAnalyzer {
  private knowledgeBase: Map<string, ProjectOutcome> = new Map();
  
  /**
   * Analyze project outcomes and extract patterns
   */
  async analyzeProjectOutcomes(
    project: GeneratedProject,
    outcomes: ProjectOutcomes
  ): Promise<PatternAnalysis> {
    // Extract success patterns
    const successPatterns = this.extractSuccessPatterns(project, outcomes);
    
    // Extract failure patterns
    const failurePatterns = this.extractFailurePatterns(project, outcomes);
    
    // Store in knowledge base
    await this.updateKnowledgeBase(project, outcomes);
    
    // Generate insights
    const insights = this.generateInsights(successPatterns, failurePatterns);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(insights);
    
    return {
      successPatterns,
      failurePatterns,
      insights,
      recommendations,
    };
  }
  
  /**
   * Extract success patterns from project
   */
  private extractSuccessPatterns(
    project: GeneratedProject,
    outcomes: ProjectOutcomes
  ): SuccessPattern[] {
    const patterns: SuccessPattern[] = [];
    
    if (!outcomes.success) return patterns;
    
    // Framework choice pattern
    patterns.push({
      type: 'framework-choice',
      data: {
        framework: project.architecture.pattern,
        score: project.quality.lighthouse.performance,
      },
      successRate: 1.0,
    });
    
    // Library combination pattern
    const libraryCombo = project.dependencies.core
      .map((lib) => lib.name)
      .sort()
      .join(',');
    
    patterns.push({
      type: 'library-combination',
      data: {
        combination: libraryCombo,
        bundleSize: project.dependencies.totalSize,
      },
      successRate: 1.0,
    });
    
    // Architecture pattern
    patterns.push({
      type: 'architecture-pattern',
      data: {
        pattern: project.architecture.pattern,
        maintainability: project.architecture.compliance.maintainability,
      },
      successRate: 1.0,
    });
    
    return patterns;
  }
  
  /**
   * Extract failure patterns from project
   */
  private extractFailurePatterns(
    project: GeneratedProject,
    outcomes: ProjectOutcomes
  ): FailurePattern[] {
    const patterns: FailurePattern[] = [];
    
    if (outcomes.success) return patterns;
    
    // Framework choice failure
    patterns.push({
      type: 'framework-choice',
      data: {
        framework: project.architecture.pattern,
        reason: outcomes.failureReason || 'Unknown',
      },
      failureRate: 1.0,
    });
    
    return patterns;
  }
  
  /**
   * Generate insights from patterns
   */
  private generateInsights(
    successPatterns: SuccessPattern[],
    failurePatterns: FailurePattern[]
  ): Insights {
    // Aggregate framework performance
    const frameworkScores: Record<string, number[]> = {};
    
    for (const pattern of successPatterns) {
      if (pattern.type === 'framework-choice') {
        const framework = pattern.data.framework as string;
        const score = pattern.data.score as number;
        
        if (!frameworkScores[framework]) {
          frameworkScores[framework] = [];
        }
        frameworkScores[framework].push(score);
      }
    }
    
    const topFrameworks = Object.entries(frameworkScores)
      .map(([framework, scores]) => ({
        framework,
        score: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    // Aggregate library combinations
    const combinationScores: Record<string, number> = {};
    
    for (const pattern of successPatterns) {
      if (pattern.type === 'library-combination') {
        const combo = pattern.data.combination as string;
        combinationScores[combo] = (combinationScores[combo] || 0) + 1;
      }
    }
    
    const optimalCombinations = Object.entries(combinationScores)
      .map(([combination, score]) => ({ combination, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    // Architecture success rates
    const architectureRates: Record<string, number> = {};
    let architectureCount = 0;
    
    for (const pattern of successPatterns) {
      if (pattern.type === 'architecture-pattern') {
        const arch = pattern.data.pattern as string;
        architectureRates[arch] = (architectureRates[arch] || 0) + 1;
        architectureCount++;
      }
    }
    
    // Normalize rates
    if (architectureCount > 0) {
      for (const arch in architectureRates) {
        const count = architectureRates[arch];
        if (count !== undefined) {
          architectureRates[arch] = count / architectureCount;
        }
      }
    }
    
    // Anti-patterns from failures
    const antiPatterns = failurePatterns.map(
      (pattern) => `${pattern.type}: ${pattern.data.reason || 'Unknown'}`
    );
    
    return {
      topFrameworks,
      optimalCombinations,
      architectureRates,
      antiPatterns,
    };
  }
  
  /**
   * Generate recommendations from insights
   */
  private generateRecommendations(insights: Insights): string[] {
    const recommendations: string[] = [];
    
    if (insights.topFrameworks.length > 0) {
      const topFramework = insights.topFrameworks[0];
      if (topFramework) {
        recommendations.push(
          `Consider using ${topFramework.framework} for similar projects (score: ${topFramework.score.toFixed(1)})`
        );
      }
    }
    
    if (insights.optimalCombinations.length > 0) {
      const topCombo = insights.optimalCombinations[0];
      if (topCombo) {
        recommendations.push(
          `Library combination "${topCombo.combination}" has shown success (${topCombo.score} projects)`
        );
      }
    }
    
    return recommendations;
  }
  
  /**
   * Update knowledge base with project outcome
   */
  private async updateKnowledgeBase(
    project: GeneratedProject,
    outcomes: ProjectOutcomes
  ): Promise<void> {
    const key = project.metadata.generationId;
    this.knowledgeBase.set(key, {
      project,
      outcomes,
      timestamp: new Date().toISOString(),
    });
  }
  
  /**
   * Get historical patterns
   */
  getHistoricalPatterns(): PatternAnalysis {
    const allProjects = Array.from(this.knowledgeBase.values());
    const successful = allProjects.filter((p) => p.outcomes.success);
    const failed = allProjects.filter((p) => !p.outcomes.success);
    
    const successPatterns: SuccessPattern[] = [];
    const failurePatterns: FailurePattern[] = [];
    
    // Aggregate patterns from all projects
    for (const { project, outcomes } of successful) {
      successPatterns.push(...this.extractSuccessPatterns(project, outcomes));
    }
    
    for (const { project, outcomes } of failed) {
      failurePatterns.push(...this.extractFailurePatterns(project, outcomes));
    }
    
    const insights = this.generateInsights(successPatterns, failurePatterns);
    const recommendations = this.generateRecommendations(insights);
    
    return {
      successPatterns,
      failurePatterns,
      insights,
      recommendations,
    };
  }
}

/**
 * Project outcomes structure
 */
interface ProjectOutcomes {
  success: boolean;
  failureReason?: string;
  metrics?: {
    performance?: number;
    userSatisfaction?: number;
    maintainability?: number;
  };
}

/**
 * Stored project outcome
 */
interface ProjectOutcome {
  project: GeneratedProject;
  outcomes: ProjectOutcomes;
  timestamp: string;
}

