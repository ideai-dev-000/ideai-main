/**
 * @fileoverview CSS Summary Component
 * 
 * @module IdeAICSSSummary
 * @description
 * Displays a summary of what CSS frameworks/presets are present in the current app.
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
}

export const IdeAICSSSummary = ({ frameworks, description }: IdeAICSSSummaryProps) => {
  return (
    <div className="ideai-css-summary">
      <div className="ideai-css-summary__content">
        <h2 className="ideai-css-summary__title">CSS Framework Summary</h2>
        {description && (
          <p className="ideai-css-summary__description">{description}</p>
        )}
        <div className="ideai-css-summary__frameworks">
          <strong>Present:</strong>{" "}
          {frameworks.map((framework, index) => (
            <span key={framework}>
              {index > 0 && ", "}
              <code className="ideai-css-summary__code">{framework}</code>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


