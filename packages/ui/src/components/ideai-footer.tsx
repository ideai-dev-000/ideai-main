/**
 * @fileoverview IdeaI footer component
 * 
 * @module IdeAIFooter
 * @description
 * Shared footer component for all IdeaI applications.
 * Uses centralized CSS classes for perfect consistency across all apps.
 * Contains comprehensive UI element test suite - all elements from pages
 * with same classes to verify perfect consistency across both apps.
 * 
 * @example
 * ```tsx
 * import { IdeAIFooter } from "@repo/ui/components/ideai-footer";
 * 
 * <IdeAIFooter />
 * ```
 * 
 * @see {@link ./ideai-header.tsx} - Header component
 */

export const IdeAIFooter = () => {
  return (
    <footer className="ideai-footer">
      <div className="ideai-footer__content">
        {/* ============================================ */}
        {/* COMPREHENSIVE UI ELEMENT TEST SUITE */}
        {/* All elements use same classes as pages */}
        {/* ============================================ */}
        
        {/* 1. Text element (p) - from .main p */}
        <p className="ideai-footer__text">© {new Date().getFullYear()} IdeaI</p>
        
        {/* 2. Link element (a) */}
        <a href="/about" className="ideai-footer__link">About</a>
        
        {/* 3. Button element - from .secondary / button.secondary */}
        <button type="button" className="ideai-footer__button">Contact</button>
        
        {/* 4. Span/Badge element */}
        <span className="ideai-footer__badge">v1.0.0</span>
        
        {/* 5. Div with text */}
        <div className="ideai-footer__div">Made with ❤️</div>
        
        {/* 6. Strong element */}
        <strong className="ideai-footer__strong">IdeaI</strong>
        
        {/* 7. Small element */}
        <small className="ideai-footer__small">All rights reserved</small>
        
        {/* 8. Unordered list (ul/li) */}
        <ul className="ideai-footer__list">
          <li className="ideai-footer__list-item">Privacy</li>
          <li className="ideai-footer__list-item">Terms</li>
        </ul>
        
        {/* 9. Code element - from .main code */}
        <code className="ideai-footer__code">npm install @repo/ui</code>
        
        {/* 10. Heading element (h3) */}
        <h3 className="ideai-footer__heading">Quick Links</h3>
        
        {/* 11. Heading h1 - from .main h1 / .ideai-header__title */}
        <h1 className="ideai-footer__h1">IdeaI Footer</h1>
        
        {/* 12. Ordered list (ol) - from .main ol */}
        <ol className="ideai-footer__ol">
          <li className="ideai-footer__ol-item">First item</li>
          <li className="ideai-footer__ol-item">Second item</li>
          <li className="ideai-footer__ol-item">Third item</li>
        </ol>
        
        {/* 13. List item - from .main li */}
        <li className="ideai-footer__li">Standalone list item</li>
        
        {/* 14. Em element */}
        <em className="ideai-footer__em">Emphasized text</em>
        
        {/* 15. Mark element */}
        <mark className="ideai-footer__mark">Highlighted text</mark>
        
        {/* 16. Blockquote element */}
        <blockquote className="ideai-footer__blockquote">
          &quot;Great design is invisible&quot;
        </blockquote>
        
        {/* 17. Pre element */}
        <pre className="ideai-footer__pre">
          <code>const test = &quot;code block&quot;;</code>
        </pre>
        
        {/* 18. Kbd element */}
        <kbd className="ideai-footer__kbd">Ctrl</kbd>
        
        {/* 19. Abbr element */}
        <abbr title="IdeaI" className="ideai-footer__abbr">IA</abbr>
        
        {/* 20. Time element */}
        <time className="ideai-footer__time" dateTime="2025-12-30">
          Dec 30, 2025
        </time>
      </div>
    </footer>
  );
};
