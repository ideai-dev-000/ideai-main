# Scripts

Utility scripts for project setup and maintenance.

## Available Scripts

### `setup-secrets.sh`

Automated script to configure GitHub secrets for CI/CD deployments.

**Usage**:
```bash
./scripts/setup-secrets.sh
```

**What it does**:
- Verifies GitHub CLI authentication
- Prompts for Vercel token
- Sets all required GitHub secrets automatically

**Prerequisites**:
- GitHub CLI (`gh`) installed and authenticated
- Vercel account access

**See also**: [GitHub Secrets Setup Documentation](../docs/setup/github-secrets.md)

## Adding New Scripts

When adding new scripts:

1. Place in `scripts/` directory
2. Make executable: `chmod +x scripts/script-name.sh`
3. Add documentation to this README
4. Reference in relevant documentation

