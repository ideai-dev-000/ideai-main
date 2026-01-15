# Slack Integration Extension Guide

This guide provides a methodical approach to extending IdeaI's Slack integration capabilities.

## Table of Contents

1. [Understanding the Manifest](#understanding-the-manifest)
2. [Adding New Features](#adding-new-features)
3. [Common Extensions](#common-extensions)
4. [Testing & Deployment](#testing--deployment)
5. [Best Practices](#best-practices)

## Understanding the Manifest

The `manifest.yaml` file defines your Slack app's configuration. It's organized into logical sections:

- **display_information**: App name, description, branding
- **features**: Bot user, commands, shortcuts, interactivity, events
- **oauth_config**: Required permissions (scopes)
- **settings**: Advanced configuration

## Adding New Features

### Step 1: Identify Requirements

1. **What Slack API method do you need?**
   - Check: https://api.slack.com/methods
   - Example: `files.upload` for file uploads

2. **What scopes are required?**
   - Check the method's documentation
   - Example: `files:write` for `files.upload`

3. **Do you need events or interactivity?**
   - Events: Real-time updates (messages, reactions, etc.)
   - Interactivity: Buttons, modals, dropdowns

### Step 2: Update Manifest

#### Add Scopes

```yaml
oauth_config:
  scopes:
    bot:
      - files:write # Add new scope here
      - files:read # Add related scopes
```

#### Add Events (if needed)

```yaml
event_subscriptions:
  bot_events:
    - file_shared # Listen for file uploads
    - reaction_added # Listen for reactions
```

#### Add Commands (if needed)

```yaml
features:
  slash_commands:
    - command: /ideai-upload
      description: Upload a file via IdeaI
      usage_hint: "[file-url]"
      request_url: "https://your-domain.com/api/slack/commands"
```

### Step 3: Implement Feature

#### Create Step File

Create `plugins/slack/steps/upload-file.ts`:

```typescript
import "server-only";
import { fetchCredentials } from "@/lib/credential-fetcher";
import { type StepInput, withStepLogging } from "@/lib/steps/step-handler";
import type { SlackCredentials } from "../credentials";

const SLACK_API_URL = "https://slack.com/api";

export type UploadFileInput = StepInput & {
  channel: string;
  fileUrl: string;
  filename: string;
  integrationId?: string;
};

async function stepHandler(
  input: { channel: string; fileUrl: string; filename: string },
  credentials: SlackCredentials,
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  const apiKey = credentials.SLACK_API_KEY;

  if (!apiKey) {
    return { success: false, error: "SLACK_API_KEY not configured" };
  }

  // Download file from URL
  const fileResponse = await fetch(input.fileUrl);
  const fileBuffer = await fileResponse.arrayBuffer();

  // Upload to Slack
  const formData = new FormData();
  formData.append("channels", input.channel);
  formData.append("file", new Blob([fileBuffer]), input.filename);

  const response = await fetch(`${SLACK_API_URL}/files.upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!result.ok) {
    return { success: false, error: result.error };
  }

  return { success: true, fileId: result.file.id };
}

export async function uploadFileStep(
  input: UploadFileInput,
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  "use step";

  const credentials = input.integrationId
    ? await fetchCredentials(input.integrationId)
    : {};

  return withStepLogging(input, () => stepHandler(input, credentials));
}
```

#### Register Action

Update `plugins/slack/index.ts`:

```typescript
actions: [
  {
    slug: "send-message",
    // ... existing action
  },
  {
    slug: "upload-file",  // New action
    label: "Upload File to Slack",
    description: "Upload a file to a Slack channel",
    category: "Slack",
    stepFunction: "uploadFileStep",
    stepImportPath: "upload-file",
    outputFields: [
      { field: "fileId", description: "Uploaded file ID" },
    ],
    configFields: [
      {
        key: "channel",
        label: "Channel",
        type: "text",
        placeholder: "#general",
        required: true,
      },
      {
        key: "fileUrl",
        label: "File URL",
        type: "text",
        placeholder: "https://example.com/file.pdf",
        required: true,
      },
      {
        key: "filename",
        label: "Filename",
        type: "text",
        placeholder: "document.pdf",
        required: true,
      },
    ],
  },
],
```

### Step 4: Test

Update `plugins/slack/test.ts` to test the new feature:

```typescript
export async function testSlackUpload(credentials: Record<string, string>) {
  // Test file upload functionality
  // ...
}
```

## Common Extensions

### 1. File Uploads

**Scopes needed:**

- `files:write`
- `files:read` (optional, for reading file info)

**API method:** `files.upload`

**Implementation:** See example above

### 2. Message Reactions

**Scopes needed:**

- `reactions:write`
- `reactions:read` (optional)

**API method:** `reactions.add`

**Example:**

```typescript
await fetch(`${SLACK_API_URL}/reactions.add`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    channel: channelId,
    timestamp: messageTs,
    name: "thumbsup",
  }),
});
```

### 3. Channel Management

**Scopes needed:**

- `channels:manage`
- `channels:join`
- `channels:read`

**API methods:**

- `conversations.create` - Create channel
- `conversations.join` - Join channel
- `conversations.archive` - Archive channel

### 4. User Lookup

**Scopes needed:**

- `users:read`
- `users:read.email` (for email addresses)

**API method:** `users.info`

**Example:**

```typescript
const response = await fetch(`${SLACK_API_URL}/users.info?user=${userId}`, {
  headers: { Authorization: `Bearer ${apiKey}` },
});
```

### 5. Message History

**Scopes needed:**

- `channels:history`
- `groups:history` (for private channels)

**API method:** `conversations.history`

### 6. Interactive Components

**Enable in manifest:**

```yaml
features:
  interactivity:
    is_enabled: true
    request_url: "https://your-domain.com/api/slack/interactivity"
```

**Create API route:** `app/api/slack/interactivity/route.ts`

**Use Block Kit** for UI components (buttons, modals, etc.)

### 7. Event Subscriptions

**Enable in manifest:**

```yaml
event_subscriptions:
  bot_events:
    - message.channels
    - app_mention
  request_url: "https://your-domain.com/api/slack/events"
```

**Create API route:** `app/api/slack/events/route.ts`

**Handle events:**

```typescript
export async function POST(request: Request) {
  const body = await request.json();

  // URL verification
  if (body.type === "url_verification") {
    return Response.json({ challenge: body.challenge });
  }

  // Handle event
  if (body.event?.type === "message") {
    // Process message event
  }

  return Response.json({ ok: true });
}
```

## Testing & Deployment

### Local Development

1. **Use Socket Mode:**

   ```yaml
   settings:
     socket_mode_enabled: true
   ```

   - Requires `SLACK_APP_TOKEN` environment variable
   - No need for public URLs

2. **Test with ngrok:**
   ```bash
   ngrok http 3000
   # Use ngrok URL in manifest request_urls
   ```

### Production Deployment

1. **Update request URLs:**
   - Replace localhost/ngrok URLs with production URLs
   - Use HTTPS for all URLs

2. **Apply manifest:**

   ```bash
   slack manifest apply --manifest manifest.yaml
   ```

3. **Re-install app:**
   - If scopes changed, re-install to workspace
   - Users need to re-authorize

4. **Monitor:**
   - Check Slack app logs
   - Monitor your API logs
   - Test all features

## Best Practices

### 1. Minimal Permissions

- Only request scopes you actually use
- Document why each scope is needed
- Review scope usage regularly

### 2. Error Handling

- Always check `result.ok` in API responses
- Provide clear error messages
- Log errors for debugging

### 3. Rate Limiting

- Slack has rate limits (see: https://api.slack.com/docs/rate-limits)
- Implement retry logic with exponential backoff
- Cache responses when possible

### 4. Security

- Never expose bot tokens in client-side code
- Use environment variables for credentials
- Validate all incoming requests (events, interactivity)
- Use HTTPS for all request URLs

### 5. Documentation

- Document each new feature
- Update manifest comments
- Keep extension guide current
- Add examples for complex features

### 6. Version Control

- Commit manifest changes
- Tag releases
- Document breaking changes
- Maintain changelog

## Example: Complete Feature Addition

Let's add "Add Reaction" functionality:

1. **Add scope to manifest:**

   ```yaml
   oauth_config:
     scopes:
       bot:
         - reactions:write # Add this
   ```

2. **Create step:** `plugins/slack/steps/add-reaction.ts`

3. **Register action:** Update `plugins/slack/index.ts`

4. **Test:** Update `plugins/slack/test.ts`

5. **Deploy:** Apply manifest, re-install app

6. **Document:** Update this guide

## Resources

- [Slack API Documentation](https://api.slack.com)
- [Slack App Manifests](https://api.slack.com/tools/manifests)
- [Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Slack Scopes](https://api.slack.com/scopes)
- [Rate Limits](https://api.slack.com/docs/rate-limits)

## Support

For issues or questions:

1. Check Slack API documentation
2. Review manifest comments
3. Check existing implementations
4. Test in development workspace first
