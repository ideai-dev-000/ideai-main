# VibeCoder Port Plan - Fresh Semantic Structure

## 🎯 Goal

Port vibecoder functionality into capabilities app using **fresh, clean, composable structure** without modifying existing working code.

## 📁 New Semantic Structure

### API Routes

```
apps/ideai-capabilities/app/api/vibe/
├── chat/
│   ├── create/route.ts          # Create new chat
│   ├── send/route.ts            # Send message to chat
│   ├── fork/route.ts            # Fork a chat
│   ├── delete/route.ts          # Delete a chat
│   └── ownership/route.ts       # Manage ownership
├── chats/
│   ├── route.ts                 # List all chats
│   └── [chatId]/
│       ├── route.ts             # Get chat details
│       ├── download/route.ts    # Download as ZIP
│       ├── assets/
│       │   ├── extract/route.ts # Extract assets
│       │   └── route.ts         # List assets
│       └── visibility/route.ts  # Update privacy
└── index.ts                     # Re-export all routes
```

### Pages

```
apps/ideai-capabilities/app/vibe/
├── page.tsx                     # Main vibe interface (home)
├── chats/
│   ├── page.tsx                 # Chat list
│   └── [chatId]/
│       └── page.tsx             # Chat detail
└── layout.tsx                   # Vibe-specific layout
```

### Components (Composable)

```
apps/ideai-capabilities/components/vibe/
├── chat/
│   ├── chat-interface.tsx       # Main chat UI
│   ├── chat-input.tsx           # Message input
│   ├── chat-messages.tsx        # Message list
│   └── chat-header.tsx          # Chat header
├── preview/
│   ├── preview-panel.tsx        # Code preview
│   ├── preview-frame.tsx        # Iframe wrapper
│   └── preview-controls.tsx     # Preview controls
├── assets/
│   ├── assets-viewer.tsx        # Asset viewer
│   └── asset-item.tsx           # Individual asset
├── home/
│   ├── vibe-home.tsx            # Home interface
│   └── vibe-suggestions.tsx     # Suggestions
└── composable/
    ├── vibe-layout.tsx          # Composable layout wrapper
    └── vibe-provider.tsx        # Context provider
```

### Hooks & Utilities

```
apps/ideai-capabilities/lib/vibe/
├── hooks/
│   ├── use-vibe-chat.ts         # Chat hook
│   ├── use-vibe-messages.ts     # Messages hook
│   └── use-vibe-streaming.ts    # Streaming hook
├── utils/
│   ├── chat-utils.ts            # Chat utilities
│   ├── asset-utils.ts           # Asset extraction
│   └── v0-client.ts             # v0 SDK wrapper
└── types/
    └── vibe-types.ts            # Type definitions
```

### Database Integration

```
apps/ideai-capabilities/lib/vibe/
└── db/
    ├── chat-queries.ts          # Chat DB queries
    └── ownership-queries.ts     # Ownership queries
```

## 🏗️ Architecture Principles

1. **Composable**: Each component is self-contained and composable
2. **Semantic**: Clear, descriptive names that explain purpose
3. **Vercel-Optimized**: Server components where possible, edge-ready
4. **Database-First**: Direct DB queries, not proxying
5. **Type-Safe**: Full TypeScript with shared types
6. **Scalable**: Easy to extend and maintain

## ✅ Porting Checklist

### Phase 1: Foundation (Structure)

- [x] Create folder structure
- [ ] Create type definitions
- [ ] Create v0 client wrapper
- [ ] Create database query helpers

### Phase 2: APIs (Backend)

- [ ] Port chat creation API
- [ ] Port message sending API
- [ ] Port chat listing API
- [ ] Port chat detail API
- [ ] Port asset extraction API
- [ ] Port download API
- [ ] Port fork/delete APIs

### Phase 3: Components (Frontend)

- [ ] Port chat interface components
- [ ] Port preview components
- [ ] Port asset viewer
- [ ] Port home interface

### Phase 4: Hooks & State

- [ ] Port chat hook
- [ ] Port streaming hook
- [ ] Port message hook
- [ ] Create vibe provider

### Phase 5: Pages & Routing

- [ ] Create vibe home page
- [ ] Create chat list page
- [ ] Create chat detail page
- [ ] Update routing (remove external redirects)

### Phase 6: Integration

- [ ] Update side menu to use internal routes
- [ ] Test end-to-end flow
- [ ] Verify workflows toggle still works

## 🚫 What NOT to Touch

**DO NOT MODIFY:**

- Existing `/api/workflows/*` routes
- Existing `/api/integrations/*` routes
- Existing `/components/workflow/*` components
- Existing `/app/workflow/*` pages
- Existing working code

**ONLY CREATE NEW:**

- `/app/api/vibe/*` (new semantic structure)
- `/components/vibe/*` (new composable components)
- `/lib/vibe/*` (new utilities)
- Update routing in side menu wrapper (minimal change)

## 📝 Notes

- Use existing auth system (`@repo/ideai-user/auth`)
- Use existing database (`@/lib/db`)
- Use existing UI components (`@repo/ui`)
- Keep composable patterns
- Semantic naming throughout
- Easy to understand and scale
