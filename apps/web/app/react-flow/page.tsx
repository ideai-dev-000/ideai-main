/**
 * @fileoverview React Flow - Semantic Pipeline Demo
 * @module apps/web/app/react-flow
 * @description
 * Interactive React Flow visualization of the semantic web development pipeline.
 * Complete site with navigation, showcasing the AI-driven development pipeline.
 */

'use client';

import React, { useState } from 'react';
import { IdeAIPageTemplate } from '@repo/ui/components/ideai-page-template';
import { SemanticPipeline } from '@repo/semantic-pipeline';
import { PipelineFlow } from '@repo/semantic-pipeline/flow';
import type { UserIntent, GeneratedProject } from '@repo/semantic-pipeline';

export default function ReactFlowPage() {
  const [intent, setIntent] = useState<UserIntent>({
    rawInput: 'Build a SaaS dashboard for e-commerce analytics showing real-time sales, customer behavior, and inventory alerts. Must support 10k concurrent users.',
    constraints: {
      performance: 'critical',
      scale: '10k',
      teamFamiliarity: ['react', 'typescript'],
    },
  });
  
  const [result, setResult] = useState<{
    project: GeneratedProject;
    recommendations: {
      framework: Array<{ framework: string; score: number; reasons: string[] }>;
      libraries: Record<string, unknown>;
    };
  } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const pipeline = new SemanticPipeline();
      const generated = await pipeline.generate({ intent });
      setResult(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || 'web';
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || 'team_vhjzlMi6CfNow0IfBXnv2Yn2';
  
  return (
    <IdeAIPageTemplate
      siteName="React Flow"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-slate-100">
            React Flow - Semantic Pipeline
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Interactive visualization of the AI-driven semantic web development pipeline
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Input Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                User Intent
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Requirements
                  </label>
                  <textarea
                    value={intent.rawInput}
                    onChange={(e) => setIntent({ ...intent, rawInput: e.target.value })}
                    className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="Describe your web application requirements..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Performance
                  </label>
                  <select
                    value={intent.constraints?.performance || 'high'}
                    onChange={(e) =>
                      setIntent({
                        ...intent,
                        constraints: {
                          ...intent.constraints,
                          performance: e.target.value as 'critical' | 'high' | 'medium' | 'low',
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Scale
                  </label>
                  <input
                    type="text"
                    value={intent.constraints?.scale || ''}
                    onChange={(e) =>
                      setIntent({
                        ...intent,
                        constraints: {
                          ...intent.constraints,
                          scale: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    placeholder="e.g., 10k, 100k, 1M"
                  />
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Project'}
                </button>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                Results
              </h2>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
              
              {result && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Recommended Framework
                    </h3>
                    {result.recommendations.framework.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {result.recommendations.framework[0]?.framework.toUpperCase()}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Score: {result.recommendations.framework[0]?.score}
                        </p>
                        <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                          {result.recommendations.framework[0]?.reasons.slice(0, 3).map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Project Metadata
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-4 text-sm">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Generated:</span>{' '}
                        {new Date(result.project.metadata.generatedAt).toLocaleString()}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        <span className="font-medium">Generation Time:</span>{' '}
                        {result.project.metadata.totalGenerationTime}ms
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        <span className="font-medium">Components:</span>{' '}
                        {result.project.components.total}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Quality Metrics
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-4 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium text-slate-600 dark:text-slate-400">Performance:</span>
                          <span className="ml-2 text-slate-900 dark:text-slate-100">
                            {result.project.quality.lighthouse.performance}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600 dark:text-slate-400">Accessibility:</span>
                          <span className="ml-2 text-slate-900 dark:text-slate-100">
                            {result.project.quality.lighthouse.accessibility}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600 dark:text-slate-400">SEO:</span>
                          <span className="ml-2 text-slate-900 dark:text-slate-100">
                            {result.project.quality.lighthouse.seo}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600 dark:text-slate-400">Bundle Size:</span>
                          <span className="ml-2 text-slate-900 dark:text-slate-100">
                            {result.project.dependencies.totalSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!result && !loading && !error && (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  Enter requirements and click "Generate Project" to see results
                </p>
              )}
            </div>
          </div>
          
          {/* Pipeline Flow Visualization */}
          {result && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
                Pipeline Flow
              </h2>
              <div className="h-[600px] border border-slate-200 dark:border-slate-700 rounded-md">
                <PipelineFlow />
              </div>
            </div>
          )}
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}

