/**
 * @fileoverview Semantic IdeaI header component with best practices
 *
 * @module IdeaIHeader
 * @description
 * Semantic header with logo/brand (left), navigation (middle), and accounts (right).
 * Includes bounce-down menu in middle that shows extra nav bar above header.
 * Uses semantic HTML5 elements and ARIA labels for accessibility.
 * Sticky header that shrinks on scroll.
 */

"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { IdeAILogo } from "./ideai-logo";
// Lazy load IdeAIDiagnostics to prevent framer-motion from blocking compilation
import type { IdeAIDiagnosticsProps } from "./ideai-diagnostics";
const IdeAIDiagnostics = lazy(() =>
  import("./ideai-diagnostics").then((module) => ({
    default: module.IdeAIDiagnostics,
  })),
) as React.LazyExoticComponent<React.ComponentType<IdeAIDiagnosticsProps>>;
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface IdeaIHeaderProps {
  siteName?: string;
  mainNav?: NavItem[];
  extraNav?: NavItem[];
  accountLinks?: {
    label: string;
    href: string;
  }[];
  sticky?: boolean;
  shrinkOnScroll?: boolean;
  fullWidth?: boolean;
  diagnosticsAppName?: string;
  headerActions?: React.ReactNode;
}

export const IdeaIHeader = ({
  siteName,
  mainNav = [
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/docs" },
    { label: "Apps", href: "/index" },
  ],
  extraNav = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Resources", href: "/resources" },
  ],
  accountLinks = [
    { label: "Sign In", href: "/signin" },
    { label: "Sign Up", href: "/signup" },
  ],
  sticky = true,
  shrinkOnScroll = true,
  fullWidth = true,
  diagnosticsAppName,
  headerActions,
}: IdeaIHeaderProps) => {
  const [isExtraNavOpen, setIsExtraNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!shrinkOnScroll) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shrinkOnScroll]);

  return (
    <>
      {/* Extra Navigation Bar - Appears above header when menu is open */}
      {isExtraNavOpen && (
        <nav
          className={`ideai-header-extra ${fullWidth ? "ideai-header-extra--full-width" : ""}`}
          aria-label="Extra navigation"
          role="navigation"
        >
          <div className="ideai-header-extra__container">
            <ul className="ideai-header-extra__list">
              {extraNav.map((item) => (
                <li key={item.href} className="ideai-header-extra__item">
                  <a
                    href={item.href}
                    className="ideai-header-extra__link"
                    onClick={() => setIsExtraNavOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Main Header */}
      <header
        className={`ideai-header ${sticky ? "ideai-header--sticky" : ""} ${isScrolled ? "ideai-header--scrolled" : ""} ${fullWidth ? "ideai-header--full-width" : ""}`}
        role="banner"
      >
        {/* IdeaI Diagnostics - First element in header DOM */}
        {diagnosticsAppName && (
          <Suspense fallback={null}>
            <IdeAIDiagnostics
              appName={diagnosticsAppName}
              position="top-right"
              visible={true}
            />
          </Suspense>
        )}

        <div className="ideai-header__container">
          {/* Left: Logo/Brand */}
          <div className="ideai-header__brand">
            <IdeAILogo siteName={siteName} />
          </div>

          {/* Middle: Navigation */}
          <nav
            className="ideai-header__nav"
            aria-label="Main navigation"
            role="navigation"
          >
            <ul className="ideai-header__nav-list">
              {mainNav.map((item) => (
                <li key={item.href} className="ideai-header__nav-item">
                  {item.children ? (
                    <div className="ideai-header__nav-dropdown">
                      <button
                        type="button"
                        className="ideai-header__nav-link"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        {item.label}
                        <span
                          className="ideai-header__nav-arrow"
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      </button>
                      <ul className="ideai-header__nav-dropdown-menu">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              className="ideai-header__nav-dropdown-link"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a href={item.href} className="ideai-header__nav-link">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Bounce-down Menu Button */}
            <button
              type="button"
              className="ideai-header__menu-toggle"
              aria-label="Toggle extra navigation"
              aria-expanded={isExtraNavOpen}
              onClick={() => setIsExtraNavOpen(!isExtraNavOpen)}
            >
              <span className="ideai-header__menu-icon" aria-hidden="true">
                {isExtraNavOpen ? "▲" : "▼"}
              </span>
              <span className="ideai-header__menu-text">More</span>
            </button>
          </nav>

          {/* Right: Theme Toggle + Mobile Nav + Accounts */}
          <div className="ideai-header__accounts">
            <nav aria-label="Account navigation" role="navigation">
              <ul className="ideai-header__accounts-list">
                {/* Header Actions - Custom actions (e.g., theme switcher) */}
                {headerActions && (
                  <li className="ideai-header__accounts-item">
                    {headerActions}
                  </li>
                )}
                {/* Theme Toggle - Top Right */}
                <li className="ideai-header__accounts-item">
                  <ThemeToggle />
                </li>
                {/* Mobile Navigation - Only visible on mobile */}
                <li className="ideai-header__accounts-item ideai-header__mobile-nav-item">
                  <MobileNav navItems={[...mainNav, ...extraNav]} />
                </li>
                {/* Desktop Account Links */}
                {accountLinks.map((link) => (
                  <li
                    key={link.href}
                    className="ideai-header__accounts-item ideai-header__accounts-item--desktop"
                  >
                    <a href={link.href} className="ideai-header__accounts-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
