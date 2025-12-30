/**
 * @fileoverview IdeaI content component with static HTML
 * 
 * @module IdeAIContent
 * @description
 * Shared content component that renders static HTML for UI consistency testing.
 * Contains the same content as the docs index page to verify perfect matching.
 * 
 * @example
 * ```tsx
 * import { IdeAIContent } from "@repo/ui/components/ideai-content";
 * 
 * <IdeAIContent />
 * ```
 * 
 * @see {@link ./ideai-header.tsx} - Header component
 * @see {@link ./ideai-footer.tsx} - Footer component
 */

export const IdeAIContent = () => {
  return (
    <div className="ideai-content">
      <article className="ideai-content__prose">
        <h1>Documentation Index</h1>
        <p>Welcome to the IdeaI monorepo documentation. This directory contains comprehensive documentation for development, deployment, and setup.</p>
        
        <h2>📋 Quick Reference</h2>
        <ul>
          <li><strong><a className="ideai-content__link" href="/docs/project-summary">Project Summary</a></strong> - High-level overview of the project</li>
          <li><strong><a className="ideai-content__link" href="/docs/development/getting-started">Getting Started</a></strong> - Start here for development</li>
          <li><strong><a className="ideai-content__link" href="/docs/deployment/overview">Deployment Overview</a></strong> - Deployment architecture</li>
        </ul>
        
        <h2>📚 Documentation Structure</h2>
        <h3>Setup Guides</h3>
        <ul>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/setup/github-secrets">GitHub Secrets Setup</a></strong></p>
            <ul>
              <li>Configure GitHub secrets for CI/CD</li>
              <li>Automated setup script documentation</li>
              <li>Manual configuration options</li>
            </ul>
          </li>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/setup/vercel-checklist">Vercel Setup Checklist</a></strong></p>
            <ul>
              <li>Quick reference for Vercel configuration</li>
              <li>Required dashboard settings</li>
              <li>Monorepo-specific requirements</li>
            </ul>
          </li>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/setup/commit-signing">Commit Signing Setup</a></strong></p>
            <ul>
              <li>✅ GPG signing configured and working</li>
              <li>Verified commits show "Verified" badge on GitHub</li>
              <li>Required for Vercel deployment protection</li>
              <li>Security best practices</li>
            </ul>
          </li>
        </ul>
        
        <h3>Deployment</h3>
        <ul>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/deployment/overview">Deployment Overview</a></strong></p>
            <ul>
              <li>Architecture and deployment process</li>
              <li>Environment descriptions</li>
              <li>Quick reference</li>
            </ul>
          </li>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/deployment/ci-cd">CI/CD Workflows</a></strong></p>
            <ul>
              <li>GitHub Actions workflow details</li>
              <li>Workflow configuration</li>
              <li>Customization guide</li>
            </ul>
          </li>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/deployment/vercel">Vercel Configuration</a></strong></p>
            <ul>
              <li>Vercel project setup</li>
              <li>Monorepo configuration</li>
              <li>Deployment process</li>
            </ul>
          </li>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/deployment/troubleshooting">Troubleshooting</a></strong></p>
            <ul>
              <li>Common issues and solutions</li>
              <li>Error message reference</li>
              <li>Debugging tips</li>
            </ul>
          </li>
        </ul>
        
        <h3>Development</h3>
        <ul>
          <li><strong><a className="ideai-content__link" href="/docs/development/getting-started">Getting Started</a></strong>
            <ul>
              <li>Initial setup instructions</li>
              <li>Development workflow</li>
              <li>Project structure</li>
            </ul>
          </li>
        </ul>
        
        <h3>Tools</h3>
        <ul>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/tools/code-context">Code Context Integration</a></strong></p>
            <ul>
              <li>Codebase analysis tool</li>
              <li>Header generation and validation</li>
              <li>Dependency visualization</li>
              <li>Local development only (not in production)</li>
            </ul>
          </li>
          <li>
            <p><strong><a className="ideai-content__link" href="/docs/tools/contentlayer">Contentlayer Integration</a></strong></p>
            <ul>
              <li>Type-safe content access for docs site</li>
              <li>SEO metadata generation</li>
              <li>Sitemap generation</li>
              <li>Semantic URLs</li>
            </ul>
          </li>
        </ul>
        
        <h2>🚀 Quick Links</h2>
        <h3>Setup</h3>
        <ol>
          <li><a className="ideai-content__link" href="/docs/setup/github-secrets">Configure GitHub Secrets</a> - <strong>Start here for CI/CD setup</strong></li>
        </ol>
        <h3>Deployment</h3>
        <ul>
          <li><a className="ideai-content__link" href="/docs/deployment/overview">Deployment Overview</a></li>
          <li><a className="ideai-content__link" href="/docs/deployment/ci-cd">CI/CD Workflows</a></li>
          <li><a className="ideai-content__link" href="/docs/deployment/vercel">Vercel Configuration</a></li>
        </ul>
        <h3>Development</h3>
        <ul>
          <li><a className="ideai-content__link" href="/docs/development/getting-started">Getting Started</a></li>
        </ul>
        
        <h2>📖 Documentation Best Practices</h2>
        <p>This documentation follows these principles:</p>
        <ul>
          <li><strong>Semantic Organization</strong>: Files organized by purpose (setup, deployment, development)</li>
          <li><strong>Clear Naming</strong>: Descriptive filenames that indicate content</li>
          <li><strong>Comprehensive Coverage</strong>: All aspects of the project documented</li>
          <li><strong>Easy Navigation</strong>: Clear structure and cross-references</li>
          <li><strong>Practical Examples</strong>: Real commands and configurations</li>
          <li><strong>Troubleshooting</strong>: Common issues and solutions included</li>
        </ul>
        
        <h2>🔄 Keeping Documentation Updated</h2>
        <p>When making changes:</p>
        <ol>
          <li>Update relevant documentation files</li>
          <li>Keep examples current</li>
          <li>Update version numbers if applicable</li>
          <li>Add troubleshooting entries for new issues</li>
          <li>Update cross-references</li>
        </ol>
        
        <h2>📝 Contributing to Documentation</h2>
        <p>To improve documentation:</p>
        <ol>
          <li>Edit files in <code>docs/</code> directory</li>
          <li>Follow existing structure and style</li>
          <li>Add practical examples</li>
          <li>Include troubleshooting when relevant</li>
          <li>Update this index if adding new sections</li>
        </ol>
        
        <h2>🔗 External Resources</h2>
        <ul>
          <li><a href="https://turbo.build/repo/docs" target="_blank" rel="noopener noreferrer">Turborepo Documentation</a></li>
          <li><a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js Documentation</a></li>
          <li><a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">Vercel Documentation</a></li>
          <li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener noreferrer">GitHub Actions Documentation</a></li>
        </ul>
        
        <h2>📧 Support</h2>
        <p>For questions or issues:</p>
        <ul>
          <li>Check <a className="ideai-content__link" href="/docs/deployment/troubleshooting">Troubleshooting</a></li>
          <li>Review relevant documentation section</li>
          <li>Open an issue on GitHub</li>
        </ul>
      </article>
    </div>
  );
};
