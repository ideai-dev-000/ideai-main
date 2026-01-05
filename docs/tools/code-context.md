---
title: Code Context Integration
description: Documentation for the Code Context tool integration, including setup, usage, and features for codebase analysis and header generation.
---
# Code Context Integration

This document describes the Code Context tool integration and usage within the IdeaI monorepo.

## Overview

**Code Context** is an intelligent codebase context analyzer that helps with:
- Developer onboarding
- Code dependency visualization
- Knowledge hotspot identification
- Learning path generation
- Code evolution tracking

**Repository**: [ideai-dev/ideai-codecontext](https://github.com/ideai-dev/ideai-codecontext)  
**Location**: `tools/code-context/` (Git submodule)  
**Tech Stack**: Kotlin/Gradle (different from main monorepo)

## Current Status

### ⚠️ Local Development Only

**Important**: Code Context is currently configured for **local development only**:
- ✅ Available for local development
- ❌ **NOT** included in production builds
- ❌ **NOT** included in preview deployments
- ❌ **NOT** part of CI/CD pipelines

### Future Plans

- 🔮 Online/cloud-hosted analysis service
- 🔮 Integration with CI/CD for code quality metrics
- 🔮 Real-time collaboration tracking
- 🔮 Development narrative generation

See [Future Integration Tasks](#future-integration-tasks) below.

## Setup

### Prerequisites

- **JDK 21+** (required for Kotlin/Gradle)
- **Git** (for Git history analysis)

### Initial Setup

The Code Context repository is included as a Git submodule:

\`\`\`bash
# Clone with submodules (if starting fresh)
git clone --recurse-submodules https://github.com/ideai-dev-000/ideai-main.git

# Or initialize existing repo
git submodule update --init --recursive
\`\`\`

### Building Code Context

\`\`\`bash
# Navigate to code-context directory
cd tools/code-context

# Build the project
./gradlew build

# Install distribution
./gradlew installDist
\`\`\`

## Usage

### Analyze This Monorepo

\`\`\`bash
# From repository root
cd tools/code-context
./gradlew run --args="analyze ../.."

# Or using installed binary
./build/install/codecontext/bin/codecontext analyze ../..
\`\`\`

### View Analysis Report

\`\`\`bash
# Open the generated report
open tools/code-context/output/index.html        # macOS
xdg-open tools/code-context/output/index.html    # Linux
start tools/code-context/output/index.html      # Windows
\`\`\`

## Integration with Our Standards

### Header Generation

Code Context can help with:
- **Header validation**: Check if files have proper headers
- **Header suggestions**: Generate headers based on code analysis
- **Header updates**: Track header evolution over time

### Code Tracking

- **Dependency graphs**: Visualize relationships between files
- **Knowledge hotspots**: Identify critical files using PageRank
- **Learning paths**: Suggest reading order for new developers
- **Change frequency**: Track which files change most often

## Configuration

### Excluding from Builds

Code Context is excluded from:
- Production builds (via `.gitignore` patterns)
- Preview deployments (not in CI/CD)
- Package installations (separate tech stack)

### Git Submodule Updates

To pull updates from the upstream repository:

\`\`\`bash
# Update to latest from ideai-dev/ideai-codecontext
cd tools/code-context
git pull origin main

# Return to monorepo root and commit submodule update
cd ../..
git add tools/code-context
git commit -m "chore: update code-context submodule"
\`\`\`

## File Structure

\`\`\`
ideai-main/
├── tools/
│   └── code-context/          # Git submodule
│       ├── src/               # Kotlin source code
│       ├── build.gradle.kts   # Gradle build config
│       └── output/             # Generated reports (gitignored)
└── apps/                       # Our apps (TypeScript/Next.js)
└── packages/                   # Our packages (TypeScript)
\`\`\`

## Best Practices

### ✅ Do's

- Use Code Context locally for analysis
- Update submodule when upstream changes
- Generate reports for code review
- Use dependency graphs for architecture decisions
- Track code evolution over time

### ❌ Don'ts

- Don't include in production builds
- Don't add to CI/CD pipelines (yet)
- Don't commit build artifacts
- Don't modify submodule directly (fork changes go upstream)

## Future Integration Tasks

### Phase 1: Local Development (Current)
- [x] Add as Git submodule
- [x] Document setup and usage
- [x] Exclude from production builds
- [ ] Create helper scripts for analysis
- [ ] Integrate header validation
- [ ] Generate dependency graphs for documentation

### Phase 2: Enhanced Local Features
- [ ] Header generation based on code analysis
- [ ] Automatic header updates on code changes
- [ ] Integration with our header standards
- [ ] Custom reports for our monorepo structure
- [ ] Learning path generation for new developers

### Phase 3: Online/Cloud Integration
- [ ] Cloud-hosted analysis service
- [ ] API integration for real-time analysis
- [ ] Integration with CI/CD for metrics
- [ ] Development narrative generation
- [ ] Collaboration tracking

### Phase 4: Advanced Features
- [ ] Blockchain-based audit trail (for compliance)
- [ ] Predictive header updates
- [ ] AI assistant integration (Copilot, Cursor, etc.)
- [ ] Real-time collaboration tracking
- [ ] Multi-repository analysis

## Troubleshooting

### Submodule Not Initialized

\`\`\`bash
git submodule update --init --recursive
\`\`\`

### Build Fails: JDK Not Found

\`\`\`bash
# Check Java version
java -version  # Should be 21+

# Install JDK 21+ if needed
# macOS: brew install openjdk@21
# Linux: sudo apt install openjdk-21-jdk
\`\`\`

### Report Not Generated

\`\`\`bash
# Ensure analysis completed successfully
cd tools/code-context
./gradlew run --args="analyze ../.."

# Check output directory
ls -la output/
\`\`\`

## Related Documentation

- [Contributing Guidelines](../CONTRIBUTING.md) - Code standards including headers
- [Project Summary](../PROJECT-SUMMARY.md) - Monorepo overview
- [Code Context Repository](https://github.com/ideai-dev/ideai-codecontext) - Upstream project

## Notes

### Why Git Submodule?

- ✅ Allows pulling updates from upstream easily
- ✅ Keeps code separate (different tech stack)
- ✅ Doesn't bloat main repository
- ✅ Clear separation of concerns
- ✅ Can be updated independently

### Tech Stack Separation

Code Context uses:
- **Kotlin** (vs our TypeScript)
- **Gradle** (vs our pnpm)
- **JVM** (vs our Node.js)

This separation is intentional and allows:
- Independent development
- Different build processes
- No dependency conflicts
- Clear boundaries

### Local-Only Usage

Currently local-only because:
- Different tech stack requires separate build
- Analysis is resource-intensive
- Not needed in production runtime
- Future cloud integration planned

## Contributing to Code Context

If you want to contribute features back to Code Context:

1. Make changes in `tools/code-context/`
2. Test locally
3. Push to your fork: `ideai-dev/ideai-codecontext`
4. Create PR to upstream if applicable
5. Update submodule reference in this repo
