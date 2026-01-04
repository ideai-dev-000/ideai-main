/**
 * @fileoverview Intelligent Component Generator
 * @module @repo/semantic-pipeline/generators/component-generator
 * @description
 * Generates semantically-aware React components with proper patterns,
 * accessibility, and responsive design.
 */

import type { GeneratedComponent } from '../types';

/**
 * Component Generator
 * 
 * Generates React components following best practices and patterns.
 */
export class ComponentGenerator {
  /**
   * Generate component from specification
   */
  async generateComponent(spec: ComponentSpec): Promise<GeneratedComponent> {
    const analysis = this.analyzeComponentRequirements(spec);
    const template = this.selectTemplate(analysis);
    const componentCode = this.generateFromTemplate(template, analysis);
    const optimizedCode = this.optimizeComponent(componentCode, analysis);
    const supportingFiles = this.generateSupportingFiles(optimizedCode, analysis);
    
    return {
      name: analysis.componentName,
      code: optimizedCode,
      type: analysis.type,
      props: this.generatePropsInterface(analysis),
      dependencies: this.extractDependencies(optimizedCode),
      testCases: this.generateTestCases(optimizedCode, analysis),
      stories: this.generateStories(analysis),
    };
  }
  
  /**
   * Analyze component requirements
   */
  private analyzeComponentRequirements(spec: ComponentSpec): ComponentAnalysis {
    return {
      componentName: this.toPascalCase(spec.name),
      type: spec.type || 'presentational',
      props: spec.props || [],
      hooks: this.determineHooks(spec),
      accessibility: this.determineAccessibility(spec),
      responsive: spec.responsive !== false,
    };
  }
  
  /**
   * Select appropriate template
   */
  private selectTemplate(analysis: ComponentAnalysis): ComponentTemplate {
    if (analysis.type === 'page') {
      return 'page';
    }
    if (analysis.type === 'container') {
      return 'container';
    }
    return 'presentational';
  }
  
  /**
   * Generate component code from template
   */
  private generateFromTemplate(
    template: ComponentTemplate,
    analysis: ComponentAnalysis
  ): string {
    if (template === 'presentational') {
      return this.generatePresentationalComponent(analysis);
    }
    if (template === 'container') {
      return this.generateContainerComponent(analysis);
    }
    return this.generatePageComponent(analysis);
  }
  
  /**
   * Generate presentational component
   */
  private generatePresentationalComponent(analysis: ComponentAnalysis): string {
    const props = analysis.props.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${p.type};`).join('\n');
    const propsDefaults = analysis.props.filter((p) => p.defaultValue).map((p) => `  ${p.name}: ${p.defaultValue}`).join(',\n');
    
    return `import React from 'react';
import type { ${analysis.componentName}Props } from './types';

export interface ${analysis.componentName}Props {
${props}
}

export const ${analysis.componentName} = React.memo<${analysis.componentName}Props>(({
${analysis.props.map((p) => `  ${p.name}${p.defaultValue ? ` = ${p.defaultValue}` : ''}`).join(',\n')}
}) => {
  return (
    <div className="${this.toKebabCase(analysis.componentName)}" role="${analysis.accessibility.role}">
      {/* Component content */}
    </div>
  );
});

${analysis.componentName}.displayName = '${analysis.componentName}';`;
  }
  
  /**
   * Generate container component
   */
  private generateContainerComponent(analysis: ComponentAnalysis): string {
    const hooks = analysis.hooks.join(', ');
    
    return `import React from 'react';
import { ${hooks} } from 'react';
import type { ${analysis.componentName}Props } from './types';

export interface ${analysis.componentName}Props {
  // Props definition
}

export const ${analysis.componentName}: React.FC<${analysis.componentName}Props> = (props) => {
  ${this.generateHooksCode(analysis)}
  
  return (
    <div className="${this.toKebabCase(analysis.componentName)}">
      {/* Component content */}
    </div>
  );
};

${analysis.componentName}.displayName = '${analysis.componentName}';`;
  }
  
  /**
   * Generate page component
   */
  private generatePageComponent(analysis: ComponentAnalysis): string {
    return `import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${analysis.componentName}',
  description: '${analysis.componentName} page',
};

export default function ${analysis.componentName}Page() {
  return (
    <main className="${this.toKebabCase(analysis.componentName)}-page">
      <h1>${analysis.componentName}</h1>
      {/* Page content */}
    </main>
  );
}`;
  }
  
  /**
   * Optimize component code
   */
  private optimizeComponent(code: string, analysis: ComponentAnalysis): string {
    // Add React.memo for presentational components
    if (analysis.type === 'presentational' && !code.includes('React.memo')) {
      code = code.replace(
        /export const (\w+) =/,
        'export const $1 = React.memo('
      );
      code += '\n);';
    }
    
    return code;
  }
  
  /**
   * Generate supporting files
   */
  private generateSupportingFiles(
    code: string,
    analysis: ComponentAnalysis
  ): Record<string, string> {
    return {
      types: this.generateTypesFile(analysis),
      styles: this.generateStylesFile(analysis),
    };
  }
  
  /**
   * Generate types file
   */
  private generateTypesFile(analysis: ComponentAnalysis): string {
    const props = analysis.props.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${p.type};`).join('\n');
    
    return `export interface ${analysis.componentName}Props {
${props}
}`;
  }
  
  /**
   * Generate styles file
   */
  private generateStylesFile(analysis: ComponentAnalysis): string {
    return `.${this.toKebabCase(analysis.componentName)} {
  /* Component styles */
}`;
  }
  
  /**
   * Generate props interface
   */
  private generatePropsInterface(analysis: ComponentAnalysis): string {
    return `export interface ${analysis.componentName}Props {
${analysis.props.map((p) => `  ${p.name}${p.required ? '' : '?'}: ${p.type};`).join('\n')}
}`;
  }
  
  /**
   * Extract dependencies from code
   */
  private extractDependencies(code: string): string[] {
    const dependencies: string[] = ['react'];
    
    if (code.includes('useState')) dependencies.push('react');
    if (code.includes('useEffect')) dependencies.push('react');
    if (code.includes('next')) dependencies.push('next');
    
    return [...new Set(dependencies)];
  }
  
  /**
   * Generate test cases
   */
  private generateTestCases(
    code: string,
    analysis: ComponentAnalysis
  ): string[] {
    return [
      `test('renders ${analysis.componentName} correctly', () => {})`,
      `test('handles props correctly', () => {})`,
    ];
  }
  
  /**
   * Generate Storybook stories
   */
  private generateStories(analysis: ComponentAnalysis): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${analysis.componentName} } from './${analysis.componentName}';

const meta: Meta<typeof ${analysis.componentName}> = {
  title: 'Components/${analysis.componentName}',
  component: ${analysis.componentName},
};

export default meta;
type Story = StoryObj<typeof ${analysis.componentName}>;

export const Default: Story = {
  args: {
    // Default props
  },
};`;
  }
  
  /**
   * Determine required hooks
   */
  private determineHooks(spec: ComponentSpec): string[] {
    const hooks: string[] = [];
    
    if (spec.hasState) hooks.push('useState');
    if (spec.hasEffects) hooks.push('useEffect');
    if (spec.hasContext) hooks.push('useContext');
    
    return hooks;
  }
  
  /**
   * Determine accessibility requirements
   */
  private determineAccessibility(spec: ComponentSpec): {
    role: string;
    ariaLabels?: string[];
  } {
    return {
      role: spec.role || 'generic',
      ariaLabels: spec.ariaLabels,
    };
  }
  
  /**
   * Generate hooks code
   */
  private generateHooksCode(analysis: ComponentAnalysis): string {
    if (analysis.hooks.length === 0) return '';
    
    return analysis.hooks.map((hook) => {
      if (hook === 'useState') {
        return 'const [state, setState] = useState();';
      }
      if (hook === 'useEffect') {
        return 'useEffect(() => {}, []);';
      }
      return '';
    }).filter(Boolean).join('\n  ');
  }
  
  /**
   * Convert to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
  
  /**
   * Convert to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}

/**
 * Component specification
 */
interface ComponentSpec {
  name: string;
  type?: 'presentational' | 'container' | 'page';
  props?: Array<{ name: string; type: string; required?: boolean; defaultValue?: unknown }>;
  hasState?: boolean;
  hasEffects?: boolean;
  hasContext?: boolean;
  responsive?: boolean;
  role?: string;
  ariaLabels?: string[];
}

/**
 * Component analysis
 */
interface ComponentAnalysis {
  componentName: string;
  type: 'presentational' | 'container' | 'page';
  props: Array<{ name: string; type: string; required?: boolean; defaultValue?: unknown }>;
  hooks: string[];
  accessibility: { role: string; ariaLabels?: string[] };
  responsive: boolean;
}

/**
 * Component template type
 */
type ComponentTemplate = 'presentational' | 'container' | 'page';

