# Commit Signing Setup

This guide explains how to set up GPG commit signing for verified commits, which is required for Vercel deployments when "Require Verified Commits" is enabled.

**Status**: ✅ Commit signing is configured and working in this project.

## Why Sign Commits?

- **Security**: Verifies that commits are from you
- **Vercel Protection**: Required for deployments when verification is enabled
- **Trust**: Shows "Verified" badge on GitHub
- **Compliance**: Meets security requirements for production deployments

## Prerequisites

- Git installed
- GPG installed (usually pre-installed on macOS/Linux)
- GitHub account

## Setup Steps

### 1. Check if GPG is Installed

```bash
gpg --version
```

If not installed:
- **macOS**: `brew install gnupg`
- **Linux**: Usually pre-installed
- **Windows**: Install [Gpg4win](https://www.gpg4win.org/)

### 2. Generate a GPG Key

```bash
gpg --full-generate-key
```

Follow the prompts:
1. **Key type**: Press Enter (default: RSA and RSA)
2. **Key size**: Enter 1** (4096 bits)
3. **Expiration**: Choose your preference (e.g., `1y` for 1 year, or `0` for no expiration)
4. **Name**: Your full name
5. **Email**: **Use the email associated with your GitHub account**
6. **Comment**: Optional
7. **Passphrase**: Create a strong passphrase (you'll need this for signing)

### 3. List Your GPG Keys

```bash
gpg --list-secret-keys --keyid-format=long
```

Look for a line like:
```
sec   rsa4096/3AA5C34371567BD2 2024-01-01 [SC]
```

The part after the `/` (e.g., `3AA5C34371567BD2`) is your **Key ID**.

### 4. Export Your Public Key

```bash
gpg --armor --export YOUR_KEY_ID
```

Copy the entire output (starts with `-----BEGIN PGP PUBLIC KEY BLOCK-----`).

### 5. Add GPG Key to GitHub

1. Go to: https://github.com/settings/gpg/new
2. Paste your public key
3. Click **"Add GPG key"**
4. Confirm with your password

### 6. Configure Git to Use Your Key

**Set the key for this repository:**
```bash
git config user.signingkey YOUR_KEY_ID
```

**Set globally (recommended):**
```bash
git config --global user.signingkey YOUR_KEY_ID
```

**Enable automatic signing for all commits:**
```bash
git config --global commit.gpgsign true
```

**Or sign commits manually:**
```bash
git commit -S -m "Your commit message"
```

### 7. Verify Your Setup

**Test signing a commit:**
```bash
git commit --allow-empty -S -m "Test signed commit"
git push
```

**Check if commit is verified:**
- Go to your GitHub repository
- Look for the "Verified" badge next to your commit

## Troubleshooting

### "gpg: signing failed: Inappropriate ioctl for device"

**Solution**: Add to your `~/.bashrc` or `~/.zshrc`:
```bash
export GPG_TTY=$(tty)
```

Then reload:
```bash
source ~/.zshrc  # or ~/.bashrc
```

### Commit Not Showing as Verified

**Solutions**:
1. Verify the email in your GPG key matches your GitHub email
2. Check GitHub has your GPG key: https://github.com/settings/gpg_keys
3. Ensure `commit.gpgsign` is set to `true`
4. Try signing a commit manually: `git commit -S -m "test"`

### "error: gpg failed to sign the data"

**Solutions**:
1. Check GPG agent is running: `gpg-agent --daemon`
2. Verify your key ID is correct: `gpg --list-secret-keys`
3. Test GPG: `echo "test" | gpg --clearsign`
4. Check passphrase is correct

### Wrong Email in GPG Key

If your GPG key has the wrong email:

1. **Edit the key:**
```bash
gpg --edit-key YOUR_KEY_ID
```

2. **In the GPG prompt:**
```
adduid
# Enter your correct email
save
```

3. **Update GitHub** with the new public key

## Best Practices

- ✅ Use a strong passphrase for your GPG key
- ✅ Set key expiration (e.g., 1-2 years)
- ✅ Use the same email as your GitHub account
- ✅ Enable automatic signing (`commit.gpgsign true`)
- ✅ Keep your private key secure (never share it)
- ✅ Export and backup your GPG key

## Backup Your GPG Key

**Export private key:**
```bash
gpg --export-secret-keys YOUR_KEY_ID > my-gpg-key-backup.asc
```

**Store securely** (encrypted file, password manager, etc.)

**Import later:**
```bash
gpg --import my-gpg-key-backup.asc
```

## Non-Interactive Environments (Cursor/AI Tools)

**Important**: In non-interactive environments where you cannot enter a passphrase (like Cursor AI tools), you must temporarily disable auto-sign:

```bash
# Disable auto-sign before committing
git config --global --unset commit.gpgsign

# Make your commit
git commit -m "Your commit message"

# Re-enable auto-sign immediately after
git config --global commit.gpgsign true
```

**Why?** GPG signing requires passphrase entry, which isn't possible in non-interactive environments. Disabling auto-sign allows commits to proceed, then re-enabling ensures future commits in your terminal will be signed.

**In your interactive terminal**, auto-sign works normally - you'll be prompted for your passphrase once, then it's cached for future commits.

## Related Documentation

- [GitHub: Signing Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [Vercel Configuration](../deployment/vercel.md)
- [Deployment Troubleshooting](../deployment/troubleshooting.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

