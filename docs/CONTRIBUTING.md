# Contributing Guidelines

This document outlines the standards and practices for contributing to this project.

## Code Standards

### Code Headers

**All code files must include rich, descriptive headers:**

```typescript
/**
 * @fileoverview Brief description of what this file does
 * 
 * @module ModuleName
 * @author Your Name
 * @created YYYY-MM-DD
 * @lastModified YYYY-MM-DD
 * 
 * @description
 * Detailed explanation of the file's purpose, key functionality,
 * and any important implementation details.
 * 
 * @example
 * // Usage example
 * import { functionName } from './file';
 * functionName();
 * 
 * @see Related files or documentation
 * @todo Any known issues or future improvements
 */
```

**Required for:**
- All TypeScript/JavaScript files
- Configuration files with complex logic
- Utility functions
- API routes
- Components with non-trivial logic

### Code Quality

- ✅ TypeScript strict mode enabled
- ✅ ESLint rules must pass
- ✅ All functions must be typed
- ✅ Error handling for async operations
- ✅ Comments for complex logic
- ✅ No `any` types (use `unknown` if needed)

## Commit Standards

### Commit Messages

**All commits must be detailed and descriptive:**

```
type(scope): detailed subject line

Detailed explanation of what changed and why.

- Specific change 1
- Specific change 2
- Specific change 3

Fixes #issue-number
Related to #issue-number
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**

```
feat(web): add user authentication flow

Implemented complete authentication system with:
- Login page with email/password
- JWT token management
- Protected route middleware
- User session persistence

Fixes #123
```

```
docs(deployment): update Vercel configuration guide

- Fixed broken relative paths in vercel-checklist.md
- Updated deployment commands to reflect root deployment
- Corrected Node.js version requirement (20, not 18)
- Added commit signing status information

All documentation now accurately reflects current setup.
```

### Commit Signing

**Important**: In non-interactive environments (like Cursor/AI tools), auto-sign must be temporarily disabled:

```bash
# Before committing in non-interactive environment
git config --global --unset commit.gpgsign

# Make commit
git commit -m "message"

# Re-enable auto-sign
git config --global commit.gpgsign true
```

**In interactive terminals**, auto-sign works normally - commits will be automatically signed.

## Documentation Standards

### Documentation Must Be OCD Accurate

**Every commit that touches documentation must ensure:**

1. **Accuracy**: All information must be 100% accurate and current
2. **Consistency**: Terminology, formatting, and style must be consistent
3. **Completeness**: All examples must work, all links must be valid
4. **Alignment**: Documentation must match actual implementation
5. **Verification**: Before committing, verify:
   - All code examples work
   - All file paths are correct
   - All version numbers are current
   - All configuration matches reality
   - All links work
   - All cross-references are correct

**Documentation Review Checklist:**

- [ ] All code examples tested and working
- [ ] All file paths verified (relative paths correct)
- [ ] All version numbers current
- [ ] All links tested and working
- [ ] All cross-references updated
- [ ] Terminology consistent across all docs
- [ ] No outdated information
- [ ] No broken references
- [ ] Status information accurate (e.g., "working", "configured")
- [ ] Instructions match current setup

**Before committing documentation changes:**

```bash
# Verify all links
grep -r "\[.*\](.*)" docs/ | while read line; do
  # Check if link works
done

# Check for broken references
grep -r "cd apps/web" docs/  # Should be minimal/contextual
grep -r "working-directory" docs/  # Should not exist
grep -r "vercel.json" docs/  # Should only mention it's not needed

# Verify code examples
# Test all commands shown in documentation
```

## CI/CD Standards

### All CI/CD Must Be Respected

**Workflow Requirements:**

1. **Linting**: All code must pass ESLint
   ```bash
   pnpm lint
   ```

2. **Type Checking**: All TypeScript must type-check
   ```bash
   pnpm check-types
   ```

3. **Build**: All apps must build successfully
   ```bash
   pnpm build
   ```

4. **Tests**: All tests must pass (when tests exist)
   ```bash
   pnpm test
   ```

**Pre-Commit Checklist:**

- [ ] `pnpm lint` passes
- [ ] `pnpm check-types` passes
- [ ] `pnpm build` succeeds
- [ ] All tests pass (if applicable)
- [ ] No console errors or warnings
- [ ] Documentation updated if code changed

**CI/CD Workflow Rules:**

- ✅ Never skip CI checks
- ✅ Never force push to protected branches
- ✅ All PRs must pass CI before merge
- ✅ Fix CI failures before requesting review
- ✅ Keep workflows up to date
- ✅ Document any workflow changes

## Development Workflow

### Before Starting Work

1. Ensure you're on latest `main` or `preview` branch
2. Create feature branch: `git checkout -b feat/feature-name`
3. Verify local environment works: `pnpm install && pnpm build`

### During Development

1. Make incremental commits with detailed messages
2. Run linting/type-checking frequently
3. Update documentation as you code
4. Test changes locally

### Before Committing

1. Run full check suite:
   ```bash
   pnpm lint
   pnpm check-types
   pnpm build
   ```

2. Review your changes:
   ```bash
   git diff
   git status
   ```

3. Ensure documentation is accurate (if changed)

4. Write detailed commit message

### After Committing

1. Push to remote
2. Create PR if ready
3. Monitor CI status
2. Address any CI failures immediately

## Pull Request Standards

### PR Requirements

- ✅ Clear, descriptive title
- ✅ Detailed description of changes
- ✅ Link to related issues
- ✅ Screenshots (for UI changes)
- ✅ All CI checks passing
- ✅ Documentation updated
- ✅ No merge conflicts

### PR Description Template

```markdown
## Description
Brief overview of what this PR does.

## Changes
- Specific change 1
- Specific change 2
- Specific change 3

## Testing
How to test these changes:
1. Step 1
2. Step 2

## Documentation
- [ ] Updated relevant documentation
- [ ] Added new documentation if needed
- [ ] Verified all links work
- [ ] Checked examples are accurate

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] CI checks pass
```

## File Organization

### Naming Conventions

- **Files**: `kebab-case.ts` or `PascalCase.tsx` (components)
- **Directories**: `kebab-case`
- **Constants**: `UPPER_SNAKE_CASE`
- **Variables/Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`

### File Structure

```
apps/web/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Utility functions
├── types/            # TypeScript types
└── hooks/            # React hooks
```

## Related Documentation

- [Getting Started](./development/getting-started.md)
- [Commit Signing Setup](./setup/commit-signing.md)
- [CI/CD Workflows](../deployment/ci-cd.md)

## Questions?

- Review existing code for examples
- Check documentation for patterns
- Ask in PR comments
- Follow established conventions
