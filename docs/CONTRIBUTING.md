# Contributing to Documentation

This document outlines best practices for maintaining and contributing to project documentation.

## Documentation Structure

Documentation is organized semantically in the `docs/` directory:

```
docs/
├── README.md                    # Documentation index
├── setup/                       # Setup and configuration guides
│   └── github-secrets.md
├── deployment/                  # Deployment documentation
│   ├── overview.md
│   ├── ci-cd.md
│   ├── vercel.md
│   └── troubleshooting.md
└── development/                # Development guides
    └── getting-started.md
```

## Naming Conventions

### File Names
- Use lowercase with hyphens: `github-secrets.md`
- Be descriptive: `ci-cd.md` not `workflows.md`
- Group by purpose: `setup/`, `deployment/`, `development/`

### Section Organization
- Start with overview/README
- Group related topics together
- Use clear hierarchy (H1 → H2 → H3)

## Documentation Standards

### Content Guidelines

1. **Clear Structure**
   - Start with overview/introduction
   - Use consistent headings
   - Include practical examples
   - Add troubleshooting sections

2. **Code Examples**
   - Use syntax highlighting
   - Include complete, working examples
   - Show expected output
   - Explain what commands do

3. **Cross-References**
   - Link to related documentation
   - Use relative paths: `[Link](./other-doc.md)`
   - Update index when adding new docs

4. **Practical Focus**
   - Include step-by-step instructions
   - Show real commands and configurations
   - Provide troubleshooting for common issues

### Formatting Standards

```markdown
# Main Title (H1)

Brief introduction paragraph.

## Section (H2)

Content with clear explanations.

### Subsection (H3)

- Use lists for steps
- Include code blocks
- Add examples

## Related Documentation

- [Link to related doc](./other.md)
```

## Adding New Documentation

### Process

1. **Determine Location**
   - Setup guides → `docs/setup/`
   - Deployment → `docs/deployment/`
   - Development → `docs/development/`

2. **Create File**
   - Use semantic naming
   - Follow existing structure
   - Include front matter if needed

3. **Write Content**
   - Start with overview
   - Include examples
   - Add troubleshooting
   - Cross-reference related docs

4. **Update Index**
   - Add to `docs/README.md`
   - Update relevant section READMEs
   - Add cross-references

5. **Review**
   - Check links work
   - Verify examples are current
   - Ensure consistency

## Updating Existing Documentation

When updating:

1. **Keep Structure**
   - Maintain existing organization
   - Don't break existing links
   - Update cross-references

2. **Version Changes**
   - Note breaking changes
   - Update examples
   - Keep troubleshooting current

3. **Test Examples**
   - Verify commands work
   - Check links are valid
   - Ensure accuracy

## Script Documentation

Scripts in `scripts/` should:

1. Include header comments
2. Document prerequisites
3. Show usage examples
4. List what the script does
5. Reference in `scripts/README.md`

## Best Practices

### Do's ✅

- Use clear, descriptive titles
- Include practical examples
- Add troubleshooting sections
- Keep documentation current
- Cross-reference related topics
- Use consistent formatting
- Include code examples
- Document edge cases

### Don'ts ❌

- Don't duplicate information
- Don't use vague titles
- Don't skip examples
- Don't forget to update links
- Don't use absolute paths
- Don't assume prior knowledge
- Don't skip troubleshooting

## Review Checklist

Before submitting documentation:

- [ ] File is in correct directory
- [ ] Name follows conventions
- [ ] Content is clear and accurate
- [ ] Examples are tested and work
- [ ] Links are valid
- [ ] Cross-references added
- [ ] Index updated
- [ ] Formatting is consistent
- [ ] Troubleshooting included (if applicable)

## Questions?

- Check existing documentation structure
- Review similar documentation files
- Follow established patterns
- Ask for review if unsure

