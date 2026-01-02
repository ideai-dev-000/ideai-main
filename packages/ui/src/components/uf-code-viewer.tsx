/**
 * @fileoverview UF Code Viewer Component
 * 
 * @file uf-code-viewer.tsx
 * @module UFCodeViewer
 * @description
 * Best practice React/Next.js code viewer component that displays the code
 * structure and classes used in the UF card. Shows real-time class changes.
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 */

"use client";

import { useState } from "react";

interface UFCodeViewerProps {
  /** Framework name */
  framework: string;
  /** Card classes */
  cardClasses: string;
  /** Button classes */
  buttonClasses: string;
  /** Input classes */
  inputClasses: string;
  /** Badge classes */
  badgeClasses: string;
  /** Title classes */
  titleClasses: string;
  /** Text classes */
  textClasses: string;
}

/**
 * UF Code Viewer Component
 * 
 * Displays the React/TSX code structure with syntax highlighting
 * and shows the actual classes being used for each framework.
 */
export const UFCodeViewer = ({
  framework,
  cardClasses,
  buttonClasses,
  inputClasses,
  badgeClasses,
  titleClasses,
  textClasses,
}: UFCodeViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const code = `// UF Card - ${framework}
<article className="${cardClasses}">
  <header>
    <h2 className="${titleClasses}">
      UF by IdeaI
    </h2>
    <p className="${textClasses}">
      Framework: ${framework}
    </p>
  </header>
  
  <div>
    <label htmlFor="input">Sample Input</label>
    <input
      id="input"
      type="text"
      className="${inputClasses}"
    />
  </div>
  
  <div>
    <button className="${buttonClasses}">
      Primary Button
    </button>
  </div>
  
  <div>
    <span className="${badgeClasses}">
      Framework
    </span>
  </div>
  
  <footer>
    <p className="${textClasses}">
      Created by IdeaI
    </p>
  </footer>
</article>`;

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Code Viewer
          </span>
          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            {framework}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Code Content - Scrollable */}
      <div className="overflow-y-auto overflow-x-auto flex-1" style={{ maxHeight: "500px" }}>
        <pre className="p-3 text-[8px] font-mono text-slate-800 dark:text-slate-200 leading-tight">
          <code className="block whitespace-pre-wrap break-words">{code}</code>
        </pre>
      </div>
    </div>
  );
};
