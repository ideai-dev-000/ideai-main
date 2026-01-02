---
title: IdeaI Documentation
description: Comprehensive documentation for the IdeaI monorepo, including setup guides, deployment instructions, and development workflows.
---

# Documentation Index

Welcome to the IdeaI monorepo documentation. This directory contains comprehensive documentation for development, deployment, and setup.

> **📊 Current Status**: See [STATUS.md](./STATUS.md) for project status, completed work, and pending tasks.  
> **📋 Phased Plan**: See [PHASES.md](./PHASES.md) for detailed implementation phases.

## 📋 Quick Reference

- **[Project Summary](./PROJECT-SUMMARY.md)** - High-level overview of the project
- **[Getting Started](./development/getting-started.md)** - Start here for development
- **[Deployment Overview](./deployment/overview.md)** - Deployment architecture

## 📚 Documentation Structure

### Setup Guides

- **[GitHub Secrets Setup](./setup/github-secrets.md)**
  - Configure GitHub secrets for CI/CD
  - Automated setup script documentation
  - Manual configuration options

- **[Vercel Setup Checklist](./setup/vercel-checklist.md)**
  - Quick reference for Vercel configuration
  - Required dashboard settings
  - Monorepo-specific requirements

- **[Commit Signing Setup](./setup/commit-signing.md)**
  - ✅ GPG signing configured and working
  - Verified commits show "Verified" badge on GitHub
  - Required for Vercel deployment protection
  - Security best practices

### Deployment

- **[Unified Deployment Guide](./deployment/unified-deployment.md)** ⭐ **Start here**
  - Deploy all apps with single command: `./deploy.sh --prod`
  - Complete deployment instructions
  - Troubleshooting guide

- **[Deployment Overview](./deployment/overview.md)**
  - Architecture and deployment process
  - Environment descriptions
  - Quick reference

- **[Deployment Architecture](./architecture/deployment-architecture.md)**
  - Main site with sub-apps
  - Standalone deployment mode
  - Routing configuration

- **[CI/CD Workflows](./deployment/ci-cd.md)**
  - GitHub Actions workflow details
  - Workflow configuration
  - Customization guide

- **[Vercel Configuration](./deployment/vercel.md)**
  - Vercel project setup
  - Monorepo configuration
  - Deployment process

- **[Troubleshooting](./deployment/troubleshooting.md)**
  - Common issues and solutions
  - Error message reference
  - Debugging tips

### Development

- **[Getting Started](./development/getting-started.md)**
  - Initial setup instructions
  - Development workflow
  - Project structure

### Architecture

- **[Design System Architecture](./architecture/design-system.md)**
  - Centralized component library
  - Shared UI components
  - Design tokens and CSS architecture

- **[UI Consistency Standards](./architecture/ui-consistency.md)**
  - Explicit color approach (RGB values)
  - DOM inspection workflow
  - Visual testing procedures
  - All apps consistency (`/web`, `/docs`, `/all`)

- **[CSS Showcase and Best Practices](./architecture/css-showcase.md)**
  - CSS approach comparison (No CSS, MVP.css, Tailwind, Combined)
  - Best practice configurations
  - Hot reload support
  - Showcase apps (`/nocss`, `/mvp`, `/tailwind`, `/allcss`)

### Tools

- **[Code Context Integration](./tools/code-context.md)**
  - Codebase analysis tool
  - Header generation and validation
  - Dependency visualization
  - Local development only (not in production)

- **[Contentlayer Integration](./tools/contentlayer.md)**
  - Type-safe content access for docs site
  - SEO metadata generation
  - Sitemap generation
  - Semantic URLs

## 🚀 Quick Links

### Setup
1. [Configure GitHub Secrets](./setup/github-secrets.md) - **Start here for CI/CD setup**

### Deployment
- [Unified Deployment Guide](./deployment/unified-deployment.md) ⭐ **Start here**
- [Deployment Overview](./deployment/overview.md)
- [Deployment Architecture](./architecture/deployment-architecture.md)
- [CI/CD Workflows](./deployment/ci-cd.md)
- [Vercel Configuration](./deployment/vercel.md)

### Development
- [Getting Started](./development/getting-started.md)

## 📖 Documentation Best Practices

This documentation follows these principles:

- **Semantic Organization**: Files organized by purpose (setup, deployment, development)
- **Clear Naming**: Descriptive filenames that indicate content
- **Comprehensive Coverage**: All aspects of the project documented
- **Easy Navigation**: Clear structure and cross-references
- **Practical Examples**: Real commands and configurations
- **Troubleshooting**: Common issues and solutions included

## 🔄 Keeping Documentation Updated

When making changes:

1. Update relevant documentation files
2. Keep examples current
3. Update version numbers if applicable
4. Add troubleshooting entries for new issues
5. Update cross-references

## 📝 Contributing to Documentation

To improve documentation:

1. Edit files in `docs/` directory
2. Follow existing structure and style
3. Add practical examples
4. Include troubleshooting when relevant
5. Update this index if adding new sections

## 🔗 External Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📧 Support

For questions or issues:
- Check [Troubleshooting](./deployment/troubleshooting.md)
- Review relevant documentation section
- Open an issue on GitHub
