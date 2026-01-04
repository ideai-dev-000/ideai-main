/**
 * @fileoverview Intelligent Library Selector
 * @module @repo/semantic-pipeline/engine/library-selector
 * @description
 * Chooses optimal libraries based on framework selection and requirements.
 * Considers complexity, performance, team preferences, and historical success data.
 * 
 * @example
 * ```typescript
 * const selector = new LibrarySelector();
 * const recommendations = await selector.selectLibraries(
 *   'react',
 *   requirements,
 *   teamProfile
 * );
 * ```
 */

import type {
  ParsedIntent,
  LibraryRecommendation,
  LibraryOption,
} from '../types';

/**
 * Intelligent library selector
 */
export class LibrarySelector {
  private categories = [
    {
      name: 'State Management',
      options: [
        { name: 'zustand', package: 'zustand', features: ['devtools', 'persist', 'immer'] },
        { name: 'redux', package: '@reduxjs/toolkit', features: ['time-travel', 'large-ecosystem'] },
        { name: 'recoil', package: 'recoil', features: ['atomic', 'react-native'] },
        { name: 'mobx', package: 'mobx', features: ['observable', 'reactive'] },
        { name: 'context-api', package: 'react', features: ['built-in', 'simple'] },
        { name: 'jotai', package: 'jotai', features: ['atomic', 'performance'] },
      ],
      selectionCriteria: ['complexity', 'devtools', 'performance', 'boilerplate'],
    },
    {
      name: 'Styling',
      options: [
        { name: 'tailwind', package: 'tailwindcss', features: ['utility-first', 'design-system'] },
        { name: 'styled-components', package: 'styled-components', features: ['css-in-js', 'theming'] },
        { name: 'emotion', package: '@emotion/react', features: ['css-in-js', 'performance'] },
        { name: 'mui', package: '@mui/material', features: ['components', 'theming'] },
        { name: 'chakra', package: '@chakra-ui/react', features: ['components', 'accessibility'] },
        { name: 'vanilla-extract', package: '@vanilla-extract/css', features: ['zero-runtime', 'type-safe'] },
      ],
      selectionCriteria: ['design-system', 'performance', 'team-preference', 'customization'],
    },
    {
      name: 'Data Fetching',
      options: [
        { name: 'react-query', package: '@tanstack/react-query', features: ['caching', 'mutations', 'ssr'] },
        { name: 'swr', package: 'swr', features: ['stale-while-revalidate', 'lightweight'] },
        { name: 'rtk-query', package: '@reduxjs/toolkit/query', features: ['redux-integration', 'caching'] },
        { name: 'axios', package: 'axios', features: ['interceptors', 'request-cancellation'] },
        { name: 'fetch', package: 'built-in', features: ['native', 'no-dependencies'] },
        { name: 'apollo', package: '@apollo/client', features: ['graphql', 'caching'] },
      ],
      selectionCriteria: ['caching', 'mutation-handling', 'ssr-support', 'bundle-size'],
    },
    {
      name: 'Form Handling',
      options: [
        { name: 'react-hook-form', package: 'react-hook-form', features: ['performance', 'validation'] },
        { name: 'formik', package: 'formik', features: ['popular', 'validation'] },
        { name: 'final-form', package: 'react-final-form', features: ['performance', 'subscriptions'] },
        { name: 'formidable', package: 'react-jsonschema-form', features: ['json-schema', 'validation'] },
      ],
      selectionCriteria: ['performance', 'validation', 'complex-forms', 'bundle-size'],
    },
  ] as const;
  
  /**
   * Select libraries for a framework and requirements
   */
  async selectLibraries(
    framework: string,
    requirements: ParsedIntent,
    teamProfile?: { preferences?: string[]; experience?: string[] }
  ): Promise<Record<string, LibraryRecommendation>> {
    const recommendations: Record<string, LibraryRecommendation> = {};
    
    for (const category of this.categories) {
      const optionsArray = category.options.map(opt => ({
        name: opt.name,
        package: opt.package,
        features: Array.from(opt.features),
      }));
      const selected = this.applySelectionRules(
        optionsArray,
        category.name,
        requirements,
        teamProfile
      );
      
      const primary = selected[0];
      if (!primary) continue;
      
      recommendations[category.name] = {
        category: category.name,
        primary,
        alternatives: selected.slice(1, 3).filter((s): s is LibraryOption => s !== undefined),
        reasoning: this.generateReasoning(category.name, primary, requirements),
      };
    }
    
    return recommendations;
  }
  
  /**
   * Apply selection rules for a category
   */
  private applySelectionRules(
    options: Array<{ name: string; package: string; features: string[] }>,
    category: string,
    requirements: ParsedIntent,
    teamProfile?: { preferences?: string[]; experience?: string[] }
  ): LibraryOption[] {
    const scored = options.map((option) => {
      let score = 0;
      
      // Team preference bonus
      if (teamProfile?.preferences?.includes(option.name)) {
        score += 10;
      }
      
      // Team experience bonus
      if (teamProfile?.experience?.includes(option.name)) {
        score += 8;
      }
      
      // Category-specific rules
      if (category === 'State Management') {
        // Complexity-based selection
        const hasComplexState = requirements.dataEntities.length > 5;
        
        if (hasComplexState) {
          if (option.name === 'redux' || option.name === 'zustand') {
            score += 5;
          }
        } else {
          if (option.name === 'context-api' || option.name === 'zustand') {
            score += 5;
          }
        }
        
        // Performance-critical
        if (requirements.technicalConstraints?.performance === 'critical') {
          if (option.name === 'zustand' || option.name === 'jotai') {
            score += 3;
          }
        }
      }
      
      if (category === 'Styling') {
        // Design system needs
        if (requirements.businessGoals.some((g) => g.toLowerCase().includes('design system'))) {
          if (option.name === 'tailwind' || option.name === 'mui' || option.name === 'chakra') {
            score += 5;
          }
        }
        
        // Performance
        if (requirements.technicalConstraints?.performance === 'critical') {
          if (option.name === 'tailwind' || option.name === 'vanilla-extract') {
            score += 3;
          }
        }
      }
      
      if (category === 'Data Fetching') {
        // Caching needs
        if (requirements.businessGoals.some((g) => g.toLowerCase().includes('real-time'))) {
          if (option.name === 'react-query' || option.name === 'swr') {
            score += 5;
          }
        }
        
        // SSR needs
        if (requirements.technicalConstraints?.scale) {
          if (option.name === 'react-query' || option.name === 'swr') {
            score += 3;
          }
        }
      }
      
      if (category === 'Form Handling') {
        // Complex forms
        const hasComplexForms = requirements.userJourneys.some(
          (j) => j.steps.length > 5
        );
        
        if (hasComplexForms) {
          if (option.name === 'react-hook-form') {
            score += 5;
          }
        }
      }
      
      // Default: prefer popular/well-maintained options
      const popularOptions = ['zustand', 'tailwind', 'react-query', 'react-hook-form'];
      if (popularOptions.includes(option.name)) {
        score += 2;
      }
      
      return { option, score };
    });
    
    // Sort by score and return
    return scored
      .sort((a, b) => b.score - a.score)
      .map(({ option }) => ({
        name: option.name,
        package: option.package,
        features: option.features,
      }));
  }
  
  /**
   * Generate reasoning for library selection
   */
  private generateReasoning(
    category: string,
    selected: LibraryOption,
    requirements: ParsedIntent
  ): string {
    const reasons: string[] = [];
    
    reasons.push(`${selected.name} is recommended for ${category} because:`);
    reasons.push(`- Features: ${selected.features.join(', ')}`);
    
    if (requirements.technicalConstraints?.performance === 'critical') {
      reasons.push(`- Optimized for performance-critical applications`);
    }
    
    return reasons.join('\n');
  }
}

