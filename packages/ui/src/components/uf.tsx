/**
 * @fileoverview UF - Universal Framework Component by IdeaI
 *
 * @file uf.tsx
 * @module UF
 * @description
 * UF (Universal Framework) is a universal framework component created by IdeaI that uses pure HTML
 * and dynamically injects the right CSS classes and styles for each CSS framework.
 *
 * Features:
 * - Hot-toggle menu to switch between all CSS frameworks
 * - Pure HTML structure with framework-specific class injection
 * - Automatic CSS loading for frameworks that require external stylesheets
 * - Self-contained in a single file for easy integration
 * - Works on any landing page as a POC
 *
 * Supported Frameworks:
 * - Tailwind CSS
 * - Bootstrap
 * - Material UI
 * - Chakra UI
 * - Radix UI
 * - shadcn/UI
 * - MVP.css
 * - Pico CSS
 * - UnoCSS
 * - No CSS (pure HTML)
 *
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { UF } from "@repo/ui/components/uf";
 *
 * <UF />
 * ```
 *
 * @todo Add framework transition animations
 * @todo Add framework-specific theme customization
 * @todo Add framework comparison metrics
 */

"use client";

import { useState } from "react";

/**
 * All CSS frameworks available in the IdeaI monorepo
 */
export type Framework =
  | "tailwind"
  | "bootstrap"
  | "material"
  | "chakra"
  | "radix"
  | "shadcn"
  | "mvp"
  | "pico"
  | "unocss"
  | "nocss";

/**
 * Framework metadata and configuration
 */
interface FrameworkInfo {
  name: string;
  description: string;
  cssUrl?: string; // CDN URL for external CSS
  cardClasses: string;
  buttonClasses: string;
  inputClasses: string;
  badgeClasses: string;
  textClasses: string;
  titleClasses: string;
}

/**
 * Complete framework configurations for all IdeaI CSS frameworks
 */
const FRAMEWORKS: Record<Framework, FrameworkInfo> = {
  tailwind: {
    name: "Tailwind CSS",
    description: "Utility-first CSS framework",
    cardClasses:
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    buttonClasses:
      "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses:
      "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses:
      "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
  },
  bootstrap: {
    name: "Bootstrap",
    description: "Popular CSS framework with components",
    cssUrl:
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    cardClasses: "card shadow-sm",
    buttonClasses: "btn btn-primary",
    inputClasses: "form-control",
    badgeClasses: "badge bg-primary",
    textClasses: "text-body",
    titleClasses: "card-title h4",
  },
  material: {
    name: "Material UI",
    description: "Google's Material Design system",
    cardClasses: "material-card",
    buttonClasses: "material-button",
    inputClasses: "material-input",
    badgeClasses: "material-badge",
    textClasses: "material-text",
    titleClasses: "material-title",
  },
  chakra: {
    name: "Chakra UI",
    description: "Modular and accessible component library",
    cssUrl:
      "https://unpkg.com/@chakra-ui/core@1.0.0/dist/chakra-ui-core.min.css",
    cardClasses: "chakra-card",
    buttonClasses: "chakra-button",
    inputClasses: "chakra-input",
    badgeClasses: "chakra-badge",
    textClasses: "chakra-text",
    titleClasses: "chakra-title",
  },
  radix: {
    name: "Radix UI",
    description: "Unstyled, accessible UI primitives",
    cardClasses: "radix-card",
    buttonClasses: "radix-button",
    inputClasses: "radix-input",
    badgeClasses: "radix-badge",
    textClasses: "radix-text",
    titleClasses: "radix-title",
  },
  shadcn: {
    name: "shadcn/UI",
    description: "Re-usable components built with Radix UI and Tailwind",
    cardClasses: "rounded-xl border bg-card text-card-foreground shadow p-6",
    buttonClasses:
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white shadow hover:bg-slate-800 h-9 px-4 py-2",
    inputClasses:
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    badgeClasses:
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    textClasses: "text-sm text-muted-foreground",
    titleClasses: "font-semibold leading-none tracking-tight text-2xl",
  },
  mvp: {
    name: "MVP.css",
    description: "Minimalist stylesheet for semantic HTML",
    cardClasses: "mvp-card",
    buttonClasses: "button button-primary",
    inputClasses: "input",
    badgeClasses: "badge",
    textClasses: "",
    titleClasses: "h2",
  },
  pico: {
    name: "Pico CSS",
    description: "Minimalist stylesheet for semantic HTML",
    cardClasses: "pico-card",
    buttonClasses: "button primary",
    inputClasses: "input",
    badgeClasses: "badge",
    textClasses: "",
    titleClasses: "h2",
  },
  unocss: {
    name: "UnoCSS",
    description: "Instant atomic CSS engine",
    cardClasses:
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6",
    buttonClasses:
      "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors",
    inputClasses:
      "px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
    badgeClasses:
      "px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium",
    textClasses: "text-slate-700 dark:text-slate-300",
    titleClasses: "text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2",
  },
  nocss: {
    name: "No CSS",
    description: "Pure HTML with browser defaults",
    cardClasses: "",
    buttonClasses: "",
    inputClasses: "",
    badgeClasses: "",
    textClasses: "",
    titleClasses: "",
  },
};

/**
 * UF Component Props
 */
export interface UFProps {
  /** Initial framework selection */
  defaultFramework?: Framework;
  /** Additional CSS classes for container */
  className?: string;
}

/**
 * UF - Universal Framework Component by IdeaI
 *
 * A single-file component that demonstrates hot-toggling between all CSS frameworks
 * available in the IdeaI monorepo. Uses pure HTML and injects framework-specific
 * classes and CSS at runtime.
 *
 * @param props - UF component props
 * @returns React component
 */
export const UF = ({ defaultFramework = "tailwind", className }: UFProps) => {
  const [selectedFramework, setSelectedFramework] =
    useState<Framework>(defaultFramework);

  const currentFramework = FRAMEWORKS[selectedFramework];

  // Generate iframe content with isolated CSS
  const generateIframeContent = (framework: Framework): string => {
    const frameworkInfo = FRAMEWORKS[framework];
    // Load framework-specific CSS
    let cssLinks = "";
    if (frameworkInfo.cssUrl) {
      cssLinks = `<link rel="stylesheet" href="${frameworkInfo.cssUrl}" crossorigin="anonymous">`;
    }

    // Load Tailwind CSS only for frameworks that actually use Tailwind
    if (framework === "tailwind" || framework === "unocss") {
      cssLinks += `<script src="https://cdn.tailwindcss.com"></script>`;
    }

    // shadcn uses Tailwind + CSS variables
    if (framework === "shadcn") {
      cssLinks += `<script src="https://cdn.tailwindcss.com"></script>`;
      cssLinks += `
      <style>
        :root {
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 222.2 84% 4.9%;
        }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .border-input { border-color: hsl(var(--input)); }
        .bg-background { background-color: hsl(var(--background)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .ring-ring { --tw-ring-color: hsl(var(--ring)); }
      </style>
      `;
    }

    // Radix UI - unstyled primitives, minimal default styling (no framework CSS)
    if (framework === "radix") {
      cssLinks += `
      <style>
        .radix-card { background: white; border: 1px solid #e2e8f0; padding: 1.5rem; }
        .radix-button { background: #000; color: white; padding: 0.5rem 1rem; border: none; cursor: pointer; font-size: 0.875rem; }
        .radix-button:hover { background: #333; }
        .radix-input { border: 1px solid #cbd5e1; padding: 0.5rem; width: 100%; font-size: 0.875rem; }
        .radix-input:focus { outline: 2px solid #000; outline-offset: 2px; }
        .radix-badge { background: #f1f5f9; color: #0f172a; padding: 0.25rem 0.5rem; font-size: 0.75rem; display: inline-block; }
        .radix-title { font-size: 1.5rem; font-weight: 500; margin-bottom: 0.5rem; }
        .radix-text { color: #334155; font-size: 0.875rem; }
      </style>
      `;
    }

    // Chakra UI - default Chakra styling (blue theme, not purple)
    if (framework === "chakra") {
      cssLinks += `
      <style>
        .chakra-card { background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
        .chakra-button { background: #3182ce; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; font-size: 0.875rem; }
        .chakra-button:hover { background: #2c5aa0; }
        .chakra-input { border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; border-radius: 0.375rem; width: 100%; font-size: 0.875rem; }
        .chakra-input:focus { border-color: #3182ce; box-shadow: 0 0 0 1px #3182ce; outline: none; }
        .chakra-badge { background: #bee3f8; color: #2c5282; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
        .chakra-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #1a202c; }
        .chakra-text { color: #4a5568; font-size: 0.875rem; }
      </style>
      `;
    }

    // Material UI - Material Design 3 default styling with enhanced visuals
    if (framework === "material") {
      cssLinks += `
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        * { font-family: 'Roboto', sans-serif; }
        .material-card { 
          background: white; 
          padding: 1.5rem; 
          border-radius: 1rem; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1); 
          border: 1px solid rgba(0,0,0,0.05);
        }
        .material-button { 
          background: #1976d2; 
          color: white; 
          padding: 0.75rem 1.75rem; 
          border-radius: 1.75rem; 
          font-weight: 500; 
          cursor: pointer; 
          border: none; 
          font-size: 0.875rem; 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
          box-shadow: 0 3px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14); 
          transition: all 0.2s;
        }
        .material-button:hover { 
          background: #1565c0; 
          box-shadow: 0 5px 10px rgba(0,0,0,0.25), 0 3px 3px rgba(0,0,0,0.18); 
        }
        .material-input { 
          border: none; 
          border-bottom: 2px solid #1976d2; 
          padding: 0.75rem 0; 
          width: 100%; 
          font-size: 0.875rem; 
          background: transparent; 
          transition: border-color 0.2s;
        }
        .material-input:focus { 
          border-bottom-color: #1976d2; 
          border-bottom-width: 3px;
          outline: none; 
        }
        .material-badge { 
          background: #e3f2fd; 
          color: #1565c0; 
          padding: 0.375rem 0.875rem; 
          border-radius: 1rem; 
          font-size: 0.75rem; 
          font-weight: 500; 
          display: inline-block;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .material-title { 
          font-size: 1.5rem; 
          font-weight: 400; 
          margin-bottom: 0.75rem; 
          color: rgba(0,0,0,0.87); 
          line-height: 1.2;
        }
        .material-text { 
          color: rgba(0,0,0,0.6); 
          font-size: 0.875rem; 
          line-height: 1.5;
        }
      </style>
      `;
    }

    if (framework === "mvp") {
      cssLinks = `<link rel="stylesheet" href="https://unpkg.com/mvp.css@1.17.2/mvp.css">`;
      cssLinks += `
      <style>
        /* MVP.css card with visible 1px border */
        .mvp-card {
          border: 1px solid #cbd5e1 !important;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      </style>
      `;
    }

    if (framework === "pico") {
      cssLinks = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">`;
      cssLinks += `
      <style>
        /* Pico CSS card with visible 1px border */
        .pico-card {
          border: 1px solid #cbd5e1 !important;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      </style>
      `;
    }

    // Base CSS for all frameworks
    const baseCSS = `
      <style>
        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 16px; 
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: transparent;
        }
      </style>
    `;

    // Escape HTML entities in code string
    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return text.replace(/[&<>"']/g, (m) => map[m] || m);
    };

    const codeText = `// UF Card - ${frameworkInfo.name}
<article className="${frameworkInfo.cardClasses || ""}">
  <header>
    <h2 className="${frameworkInfo.titleClasses || ""}">
      UF by IdeaI
    </h2>
    <p className="${frameworkInfo.textClasses || ""}">
      Framework: ${frameworkInfo.name}
    </p>
  </header>
  
  <div>
    <label htmlFor="input">Sample Input</label>
    <input
      id="input"
      type="text"
      className="${frameworkInfo.inputClasses || ""}"
    />
  </div>
  
  <div>
    <button className="${frameworkInfo.buttonClasses || ""}">
      Primary Button
    </button>
  </div>
  
  <div>
    <span className="${frameworkInfo.badgeClasses || ""}">
      Framework
    </span>
  </div>
  
  <footer>
    <p className="${frameworkInfo.textClasses || ""}">
      Created by IdeaI
    </p>
  </footer>
</article>`;

    const code = escapeHtml(codeText);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${cssLinks}
  ${baseCSS}
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 12px;
      height: 100%;
      min-height: 100vh;
      overflow: hidden;
    }
    .uf-container {
      display: flex;
      gap: 1rem;
      width: 100%;
      height: 100%;
      min-height: 100%;
      align-items: flex-start;
    }
    .uf-card-panel {
      flex: 0 0 33.333%;
      min-width: 0;
      max-width: 33.333%;
    }
    .uf-code-panel {
      flex: 0 0 66.667%;
      min-width: 0;
      max-width: 66.667%;
      border-left: 1px solid #e2e8f0;
      padding-left: 1rem;
      padding-right: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
    }
    .uf-code-header {
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #64748b;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    .uf-code-scroll {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;
      min-height: 0;
    }
    .uf-code-content {
      font-size: 9px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      line-height: 1.4;
      color: #1e293b;
      white-space: pre;
      word-break: normal;
      margin: 0;
      padding: 0;
      background: transparent;
      border: none;
    }
    .uf-code-content code {
      font-size: 9px;
      font-family: inherit;
      color: inherit;
      background: transparent;
      padding: 0;
      margin: 0;
      border: none;
    }
  </style>
</head>
<body>
  <div class="uf-container">
    <!-- Left: Card Panel -->
    <div class="uf-card-panel">
      <article class="${frameworkInfo.cardClasses || ""}">
        <header style="margin-bottom: 1rem;">
          <h2 class="${frameworkInfo.titleClasses || ""}">UF by IdeaI</h2>
          <p class="${frameworkInfo.textClasses || ""}" style="font-size: 0.875rem;">
            Live preview with <strong>${frameworkInfo.name}</strong> classes.
          </p>
        </header>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <label for="uf-iframe-input" style="display: block; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.25rem;">Sample Input</label>
            <input
              id="uf-iframe-input"
              type="text"
              class="${frameworkInfo.inputClasses || ""}"
              value="Sample input text"
              placeholder="Type something..."
              style="width: 100%;"
            />
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="${frameworkInfo.buttonClasses || ""}">Primary</button>
            <button type="button" class="${frameworkInfo.buttonClasses || ""}">Secondary</button>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <span class="${frameworkInfo.badgeClasses || ""}">Framework</span>
            <span class="${frameworkInfo.badgeClasses || ""}">${frameworkInfo.name}</span>
            <span class="${frameworkInfo.badgeClasses || ""}">IdeaI</span>
          </div>
        </div>
        <footer style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #e2e8f0;">
          <p class="${frameworkInfo.textClasses || ""}" style="font-size: 0.75rem; margin: 0;">
            Created by <strong>IdeaI</strong> • ${new Date().getFullYear()}
          </p>
        </footer>
      </article>
    </div>
    
    <!-- Right: Code Panel -->
    <div class="uf-code-panel">
      <div class="uf-code-header">Code Viewer - ${frameworkInfo.name}</div>
      <div class="uf-code-scroll">
        <pre class="uf-code-content"><code>${code}</code></pre>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  // Get all framework keys for menu
  const frameworkKeys = Object.keys(FRAMEWORKS) as Framework[];

  return (
    <div
      className={`uf-container w-full ${className || ""}`}
      style={{ width: "100%", maxWidth: "100%" }}
    >
      {/* Framework List - Top */}
      <div className="mb-6 w-full">
        <nav className="flex flex-wrap gap-2" aria-label="Framework selection">
          {frameworkKeys.map((framework) => {
            const frameworkInfo = FRAMEWORKS[framework];
            const isSelected = framework === selectedFramework;
            const logo = frameworkInfo.name.charAt(0).toUpperCase();
            return (
              <button
                key={framework}
                type="button"
                onClick={() => setSelectedFramework(framework)}
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 font-medium"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                aria-current={isSelected ? "page" : undefined}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-200"
                  }`}
                >
                  {logo}
                </div>
                <div className="text-sm">{frameworkInfo.name}</div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Full Width Iframe with Card and Code Panel Inside */}
      <div className="w-full" style={{ width: "100%", maxWidth: "100%" }}>
        <iframe
          key={selectedFramework}
          srcDoc={generateIframeContent(selectedFramework)}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
          style={{
            width: "100%",
            minHeight: "500px",
            height: "500px",
            maxWidth: "100%",
          }}
          title={`UF Card - ${currentFramework.name}`}
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
};
