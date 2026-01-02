/**
 * @fileoverview CSS Summary Component
 * 
 * @module IdeAICSSSummary
 * @description
 * Displays a summary of what CSS frameworks/presets are present in the current app.
 * Includes a card demo on the right showing framework-specific styling.
 * 
 * @example
 * ```tsx
 * <IdeAICSSSummary
 *   frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
 * />
 * ```
 */

interface IdeAICSSSummaryProps {
  frameworks: string[];
  description?: string;
  stacked?: boolean;
}

/**
 * Get card classes based on detected frameworks
 */
function getCardClasses(frameworks: string[]): {
  card: string;
  title: string;
  description: string;
  text: string;
} {
  const frameworkStr = frameworks.join(" ").toLowerCase();

  // Bootstrap
  if (frameworkStr.includes("bootstrap")) {
    return {
      card: "card shadow-sm",
      title: "card-title h5 mb-2",
      description: "card-text text-muted mb-3",
      text: "text-body",
    };
  }

  // Material UI
  if (frameworkStr.includes("material")) {
    return {
      card: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 border border-slate-200 dark:border-slate-700",
      title: "text-xl font-medium text-slate-900 dark:text-slate-100 mb-2",
      description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
      text: "text-sm text-slate-700 dark:text-slate-300",
    };
  }

  // Chakra UI
  if (frameworkStr.includes("chakra")) {
    return {
      card: "bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 border border-slate-200 dark:border-slate-700",
      title: "text-xl font-bold text-slate-900 dark:text-slate-100 mb-2",
      description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
      text: "text-sm text-slate-700 dark:text-slate-300",
    };
  }

  // Radix UI
  if (frameworkStr.includes("radix")) {
    return {
      card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4",
      title: "text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2",
      description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
      text: "text-sm text-slate-700 dark:text-slate-300",
    };
  }

  // shadcn/UI
  if (frameworkStr.includes("shadcn")) {
    return {
      card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4",
      title: "text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2",
      description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
      text: "text-sm text-slate-700 dark:text-slate-300",
    };
  }

  // UnoCSS
  if (frameworkStr.includes("unocss")) {
    return {
      card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-4",
      title: "text-xl font-bold text-slate-900 dark:text-slate-100 mb-2",
      description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
      text: "text-sm text-slate-700 dark:text-slate-300",
    };
  }

  // MVP.css or No CSS - use semantic HTML
  if (frameworkStr.includes("mvp") || frameworkStr.includes("browser defaults") || frameworkStr.includes("nocss")) {
    return {
      card: "border border-slate-300 dark:border-slate-600 rounded p-4 bg-slate-50 dark:bg-slate-800",
      title: "text-xl font-bold mb-2",
      description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
      text: "text-sm",
    };
  }

  // Default: Tailwind CSS (most common)
  return {
    card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-4",
    title: "text-xl font-bold text-slate-900 dark:text-slate-100 mb-2",
    description: "text-sm text-slate-600 dark:text-slate-400 mb-3",
    text: "text-sm text-slate-700 dark:text-slate-300",
  };
}

export const IdeAICSSSummary = ({ frameworks, description, stacked = false }: IdeAICSSSummaryProps) => {
  const cardClasses = getCardClasses(frameworks);

  return (
    <div className={`ideai-css-summary ${stacked ? "ideai-css-summary--stacked" : ""}`}>
      <div className="ideai-css-summary__content">
        <div className="ideai-css-summary__grid">
          {/* Left: Summary Info */}
          <div className="ideai-css-summary__info">
            <h2 className="ideai-css-summary__title">CSS Framework Summary</h2>
            {description && (
              <p className="ideai-css-summary__description">{description}</p>
            )}
            <div className="ideai-css-summary__frameworks">
              <strong>Present:</strong>
              {frameworks.map((framework) => (
                <code key={framework} className="ideai-css-summary__code">
                  {framework}
                </code>
              ))}
            </div>
          </div>

          {/* Right: Card Demo */}
          <div className="ideai-css-summary__demo">
            <div className={cardClasses.card}>
              <h3 className={cardClasses.title}>Card Example</h3>
              <p className={cardClasses.description}>
                This card uses framework-specific styling classes.
              </p>
              <p className={cardClasses.text}>
                Demonstrates how each framework renders components differently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



