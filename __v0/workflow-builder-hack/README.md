# AI Workflow Builder Template

A template for building your own AI-driven workflow automation platform. Built on top of Workflow DevKit, this template provides a complete visual workflow builder with real integrations and code generation capabilities.

![AI Workflow Builder Screenshot](screenshot.png)

## Deploy Your Own

You can deploy your own version of the workflow builder to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.new/workflow-builder)

**What happens during deployment:**

- **Automatic Database Setup**: A Neon Postgres database is automatically created and connected to your project
- **Environment Configuration**: You'll be prompted to provide required environment variables (Better Auth credentials and AI Gateway API key)
- **Ready to Use**: After deployment, you can start building workflows immediately

## What's Included

- **Visual Workflow Builder** - Drag-and-drop interface powered by React Flow
- **Workflow DevKit Integration** - Built on top of Workflow DevKit for powerful execution capabilities
- **Real Integrations** - Connect to Resend (emails), Linear (tickets), Slack, PostgreSQL, and external APIs
- **Code Generation** - Convert workflows to executable TypeScript with `"use workflow"` directive
- **Execution Tracking** - Monitor workflow runs with detailed logs
- **Authentication** - Secure user authentication with Better Auth
- **AI-Powered** - Generate workflows from natural language descriptions using OpenAI
- **Database** - PostgreSQL with Drizzle ORM for type-safe database access
- **Modern UI** - Beautiful shadcn/ui components with dark mode support

## Getting Started

> **📖 For detailed local development setup, see [SETUP.md](./SETUP.md)**

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- pnpm package manager

### Environment Variables

Create a `.env.local` file with the following:

```env
# Database Configuration
# Option 1: Use DATABASE_URL for explicit control (highest priority)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workflow_builder

# Option 2: Use separate URLs and toggle with USE_CLOUD_DB (recommended)
DATABASE_LOCAL_URL=postgresql://postgres:postgres@localhost:5432/workflow_builder
DATABASE_CLOUD_URL=postgresql://user:password@your-cloud-db.com:5432/workflow_builder
USE_CLOUD_DB=false  # Set to "true" to use cloud database

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3888
NEXT_PUBLIC_APP_URL=http://localhost:3888

# App Mode (optional - defaults to "workflow")
# Set to "architecture" to enable architecture diagram mode
# APP_MODE=workflow  # or "architecture"
# NEXT_PUBLIC_APP_MODE=workflow  # for client-side access

# Integration Encryption (required for saving API credentials)
# Generate with: openssl rand -hex 32
INTEGRATION_ENCRYPTION_KEY=your-64-character-hex-key-here

# AI Provider Configuration (for AI workflow generation)
# Default: Uses AI_GATEWAY_API_KEY or OPENAI_API_KEY if AI_PROVIDER is not set

# Option 1: AI Gateway (default - supports multiple providers) - ACTIVE
AI_GATEWAY_API_KEY=vck_2DHExl3db0AK9GFV6atCkabj9mVRVnrRvqy9SbIiKyXz22aSbR0kct8k
AI_MODEL=openai/gpt-5.1-instant  # Optional: override default model

# Option 2: OpenAI (direct) - COMMENTED OUT
# AI_PROVIDER=openai
# OPENAI_API_KEY=your-openai-api-key
# AI_MODEL=gpt-4o  # Optional: gpt-4o, gpt-4o-mini, gpt-4-turbo, etc.

# Option 3: Anthropic (Claude) - COMMENTED OUT
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your-anthropic-api-key
# AI_MODEL=claude-3-5-sonnet-20241022  # Optional: claude-3-5-haiku, claude-3-opus, etc.

# Option 4: Google (Gemini) - COMMENTED OUT
# AI_PROVIDER=google
# GOOGLE_AI_API_KEY=your-google-api-key
# # OR
# GEMINI_API_KEY=your-gemini-api-key
# AI_MODEL=gemini-2.0-flash-exp  # Optional: gemini-1.5-pro, gemini-1.5-flash, etc.

# Option 5: Ollama (local models) - COMMENTED OUT
# AI_PROVIDER=ollama
# OLLAMA_BASE_URL=http://localhost:11434  # Optional: defaults to localhost:11434
# AI_MODEL=llama3.3:70b  # Optional: deepseek-r1:32b, qwen2.5-coder:32b, gemma3:27b, etc.

# Option 6: OpenRouter (access to multiple models) - COMMENTED OUT
# AI_PROVIDER=openrouter
# OPENROUTER_API_KEY=your-openrouter-api-key
# AI_MODEL=meta-llama/llama-3.3-70b-instruct  # Optional: any OpenRouter model
# OPENROUTER_HTTP_REFERER=https://your-domain.com  # Optional: for analytics
# OPENROUTER_X_TITLE=Workflow Builder  # Optional: app name for analytics
```

#### Available Models by Provider

**AI Gateway** (default): `openai/gpt-5.1-instant`, `openai/gpt-5.2`, `openai/gpt-5.2-pro`, `anthropic/claude-sonnet-4.5`, `meta/llama-4-scout`, `google/gemini-2.5-pro`, etc.

**OpenAI**: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`, `o1-preview`, `o1-mini`

**Anthropic**: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, `claude-3-opus-20240229`, `claude-3-sonnet-20240229`

**Google**: `gemini-2.0-flash-exp`, `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-pro`

**Ollama** (local): `llama3.3:70b`, `deepseek-r1:32b`, `qwen2.5-coder:32b`, `gemma3:27b`, `devstral:24b`, `deepseek-coder-v2:16b`, `qwen3:14b`, `gemma2:9b`, `llama3.1:8b`, `dolphin-llama3:8b`, `qwen2.5-coder:7b`

**OpenRouter**: `meta-llama/llama-3.3-70b-instruct`, `deepseek/deepseek-r1:32b`, `qwen/qwen-2.5-coder-32b-instruct`, and many more

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

Visit [http://localhost:3888](http://localhost:3888) to get started.

## Workflow Types

### Trigger Nodes

- Webhook
- Schedule
- Manual
- Database Event

### Action Nodes

<!-- PLUGINS:START - Do not remove. Auto-generated by discover-plugins -->
- **AI Gateway**: Generate Text, Generate Image
- **Blob**: Put Blob, List Blobs
- **Clerk**: Get User, Create User, Update User, Delete User
- **fal.ai**: Generate Image, Generate Video, Upscale Image, Remove Background, Image to Image
- **Firecrawl**: Scrape URL, Search Web
- **GitHub**: Create Issue, List Issues, Get Issue, Update Issue
- **Linear**: Create Ticket, Find Issues
- **Perplexity**: Search Web, Ask Question, Research Topic
- **Resend**: Send Email
- **Slack**: Send Slack Message
- **Stripe**: Create Customer, Get Customer, Create Invoice
- **Superagent**: Guard, Redact
- **v0**: Create Chat, Send Message
- **Webflow**: List Sites, Get Site, Publish Site
<!-- PLUGINS:END -->

## Code Generation

Workflows can be converted to executable TypeScript code with the `"use workflow"` directive:

```typescript
export async function welcome(email: string, name: string, plan: string) {
  "use workflow";

  const { subject, body } = await generateEmail({
    name,
    plan,
  });

  const { status } = await sendEmail({
    to: email,
    subject,
    body,
  });

  return { status, subject, body };
}
```

### Generate Code for a Workflow

```bash
# Via API
GET /api/workflows/{id}/generate-code
```

The generated code includes:

- Type-safe TypeScript
- Real integration calls
- Error handling
- Execution logging

## API Endpoints

### Workflow Management

- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create a new workflow
- `GET /api/workflows/{id}` - Get workflow by ID
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow

### Workflow Execution

- `POST /api/workflows/{id}/execute` - Execute a workflow
- `GET /api/workflows/{id}/executions` - Get execution history
- `GET /api/workflows/executions/{executionId}/logs` - Get detailed execution logs

### Code Generation

- `GET /api/workflows/{id}/generate-code` - Generate TypeScript code
- `POST /api/workflows/{id}/generate-code` - Generate with custom options

### AI Generation

- `POST /api/ai/generate-workflow` - Generate workflow from prompt

## Database Schema

### Tables

- `user` - User accounts
- `session` - User sessions
- `workflows` - Workflow definitions
- `workflow_executions` - Execution history
- `workflow_execution_logs` - Detailed node execution logs

## Development

### Scripts

```bash
# Development
pnpm dev

# Build
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm check

# Formatting
pnpm fix

# Database
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## Integrations

### Resend (Email)

Send transactional emails with Resend's API.

```typescript
import { sendEmail } from "@/lib/integrations/resend";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  body: "Welcome to our platform",
});
```

### Linear (Tickets)

Create and manage Linear issues.

```typescript
import { createTicket } from "@/lib/integrations/linear";

await createTicket({
  title: "Bug Report",
  description: "Something is broken",
  priority: 1,
});
```

### PostgreSQL

Direct database access for queries and updates.

```typescript
import { queryData } from "@/lib/integrations/database";

await queryData("users", { email: "user@example.com" });
```

### External APIs

Make HTTP requests to any API.

```typescript
import { callApi } from "@/lib/integrations/api";

await callApi({
  url: "https://api.example.com/endpoint",
  method: "POST",
  body: { data: "value" },
});
```

### Firecrawl (Web Scraping)

Scrape websites and search the web with Firecrawl.

```typescript
import {
  firecrawlScrapeStep,
  firecrawlSearchStep,
} from "@/lib/steps/firecrawl";

// Scrape a URL
const scrapeResult = await firecrawlScrapeStep({
  url: "https://example.com",
  formats: ["markdown"],
});

// Search the web
const searchResult = await firecrawlSearchStep({
  query: "AI workflow builders",
  limit: 5,
});
```

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Workflow Engine**: Workflow DevKit
- **UI**: shadcn/ui with Tailwind CSS
- **State Management**: Jotai
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Code Editor**: Monaco Editor
- **Workflow Canvas**: React Flow
- **AI**: OpenAI GPT-5
- **Type Checking**: TypeScript
- **Code Quality**: Ultracite (formatter + linter)

## About Workflow DevKit

This template is built on top of Workflow DevKit, a powerful workflow execution engine that enables:

- Native TypeScript workflow definitions with `"use workflow"` directive
- Type-safe workflow execution
- Automatic code generation from visual workflows
- Built-in logging and error handling
- Serverless deployment support

Learn more about Workflow DevKit at [useworkflow.dev](https://useworkflow.dev)

## License

Apache 2.0
