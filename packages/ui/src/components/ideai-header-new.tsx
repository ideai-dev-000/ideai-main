/**
 * @fileoverview Semantic IdeaI header component with best practices
 * 
 * @module IdeAIHeaderNew
 * @description
 * Semantic header with logo/brand (left), navigation (middle), and accounts (right).
 * Includes bounce-down menu in middle that shows extra nav bar above header.
 * Uses semantic HTML5 elements and ARIA labels for accessibility.
 */

"use client";

import { useState, useEffect } from "react";
import { IdeAILogo } from "./ideai-logo";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface IdeAIHeaderNewProps {
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
}

export const IdeAIHeaderNew = ({
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
}: IdeAIHeaderNewProps) => {
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
        className={`ideai-header-new ${sticky ? "ideai-header-new--sticky" : ""} ${isScrolled ? "ideai-header-new--scrolled" : ""} ${fullWidth ? "ideai-header-new--full-width" : ""}`}
        role="banner"
      >
        <div className="ideai-header-new__container">
          {/* Left: Logo/Brand */}
          <div className="ideai-header-new__brand">
            <IdeAILogo siteName={siteName} />
          </div>

          {/* Middle: Navigation */}
          <nav
            className="ideai-header-new__nav"
            aria-label="Main navigation"
            role="navigation"
          >
            <ul className="ideai-header-new__nav-list">
              {mainNav.map((item) => (
                <li key={item.href} className="ideai-header-new__nav-item">
                  {item.children ? (
                    <div className="ideai-header-new__nav-dropdown">
                      <button
                        type="button"
                        className="ideai-header-new__nav-link"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        {item.label}
                        <span className="ideai-header-new__nav-arrow" aria-hidden="true">
                          ▼
                        </span>
                      </button>
                      <ul className="ideai-header-new__nav-dropdown-menu">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              className="ideai-header-new__nav-dropdown-link"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a href={item.href} className="ideai-header-new__nav-link">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Bounce-down Menu Button */}
            <button
              type="button"
              className="ideai-header-new__menu-toggle"
              aria-label="Toggle extra navigation"
              aria-expanded={isExtraNavOpen}
              onClick={() => setIsExtraNavOpen(!isExtraNavOpen)}
            >
              <span className="ideai-header-new__menu-icon" aria-hidden="true">
                {isExtraNavOpen ? "▲" : "▼"}
              </span>
              <span className="ideai-header-new__menu-text">More</span>
            </button>
          </nav>

          {/* Right: Accounts */}
          <div className="ideai-header-new__accounts">
            <nav aria-label="Account navigation" role="navigation">
              <ul className="ideai-header-new__accounts-list">
                {accountLinks.map((link) => (
                  <li key={link.href} className="ideai-header-new__accounts-item">
                    <a
                      href={link.href}
                      className="ideai-header-new__accounts-link"
                    >
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

