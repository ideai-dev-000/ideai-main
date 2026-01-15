# Static Workflows Plugin

## Overview

Static workflows are hardcoded workflow actions that run as simple functions. No user input fields - just run actions as functions that always work.

## Structure

Actions are organized as semantic files/folders for easy maintenance:

```
workflows-static/
├── index.ts              # Plugin registration
├── icon.tsx              # Plugin icon
├── workflow-definition.ts # Pre-defined workflow structure
├── steps/
│   ├── trigger.ts        # Start workflow
│   ├── requirement-taker.ts
│   ├── task-generator.ts
│   ├── development.ts   # Parallel phase
│   ├── design.ts         # Parallel phase
│   ├── data.ts           # Parallel phase
│   ├── build.ts          # Converges the three
│   ├── qa.ts
│   ├── deploy.ts
│   ├── maintain.ts
│   └── archive.ts        # Final step
└── README.md
```

## Workflow Flow

```
Trigger
  ↓
Requirement Taker
  ↓
Task Generator
  ↓
┌─────────────┬─────────────┬─────────────┐
│ Development │   Design     │    Data     │
└─────────────┴─────────────┴─────────────┘
  ↓              ↓              ↓
         ┌───────┴───────┐
         │     Build      │
         └───────┬───────┘
                 ↓
                QA
                 ↓
              Deploy
                 ↓
             Maintain
                 ↓
              Archive
```

## Adding New Actions

1. Create a new file in `steps/` with semantic name (e.g., `my-action.ts`)
2. Export a function named `{actionName}Step` that takes `StepContext` and returns `StepResult`
3. Add the action to `index.ts` in the `actions` array`
4. Add step registry entry in `lib/step-registry.ts`

## Organizing Complex Actions

If an action becomes bloated:

1. Create a folder with the same name as the action (e.g., `my-action/`)
2. Move the main step file to `my-action/index.ts`
3. Split functionality into separate files in the folder
4. Import and use them in the main step function

Example:

```
steps/
├── my-action/
│   ├── index.ts          # Main step function
│   ├── helper.ts         # Helper functions
│   └── types.ts          # Type definitions
```

## Benefits

- **No user input complexity** - actions just run
- **Semantic organization** - easy to find and maintain
- **Always work** - hardcoded functions can't fail
- **Quick to build** - no field configuration needed
- **Easy to extend** - add new actions as files/folders
