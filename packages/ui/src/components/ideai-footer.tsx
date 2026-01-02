/**
 * @fileoverview Semantic IdeaI footer component with best practices
 * 
 * @module IdeAIFooter
 * @description
 * Semantic footer with logo/brand, three-column layout (left: address/copyright,
 * middle: navigation, right: social/contact), and structured data for SEO.
 * Uses semantic HTML5 elements and ARIA labels for accessibility.
 */

import { IdeAILogo } from "./ideai-logo";

interface FooterNavItem {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon?: string;
}

interface IdeAIFooterProps {
  siteName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  copyright?: string;
  footerNav?: FooterNavItem[];
  socialLinks?: SocialLink[];
  accountLinks?: FooterNavItem[];
}

export const IdeAIFooter = ({
  siteName,
  address = {
    street: "123 Innovation Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
  },
  phone = "+1 (555) 123-4567",
  email = "hello@ideai.space",
  copyright = `© ${new Date().getFullYear()} IdeaI. All rights reserved.`,
  footerNav = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Documentation", href: "/docs" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  socialLinks = [
    { label: "Twitter", href: "https://twitter.com/ideai", icon: "🐦" },
    { label: "GitHub", href: "https://github.com/ideai-dev-000", icon: "💻" },
    { label: "LinkedIn", href: "https://linkedin.com/company/ideai", icon: "💼" },
  ],
  accountLinks = [
    { label: "Sign In", href: "/signin" },
    { label: "Sign Up", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
}: IdeAIFooterProps) => {
  return (
    <footer
      className="ideai-footer"
      role="contentinfo"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="ideai-footer__container">
        {/* Three-Column Layout */}
        <div className="ideai-footer__columns">
          {/* Left: Brand, Address & Copyright */}
          <div className="ideai-footer__column ideai-footer__column--left">
            {/* Logo/Brand Area */}
            <div className="ideai-footer__brand">
              <IdeAILogo siteName={siteName} />
            </div>
            <address className="ideai-footer__address" itemScope itemType="https://schema.org/PostalAddress">
              {address.street && (
                <span itemProp="streetAddress" className="ideai-footer__address-line">
                  {address.street}
                </span>
              )}
              <span className="ideai-footer__address-line">
                {address.city && <span itemProp="addressLocality">{address.city}</span>}
                {address.state && <span itemProp="addressRegion">, {address.state}</span>}
                {address.zip && <span itemProp="postalCode"> {address.zip}</span>}
                {address.country && <span itemProp="addressCountry">, {address.country}</span>}
              </span>
            </address>

            {phone && (
              <div className="ideai-footer__contact">
                <span className="ideai-footer__contact-label">Tell:</span>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="ideai-footer__contact-link"
                  itemProp="telephone"
                >
                  {phone}
                </a>
              </div>
            )}

            {email && (
              <div className="ideai-footer__contact">
                <span className="ideai-footer__contact-label">Email:</span>
                <a
                  href={`mailto:${email}`}
                  className="ideai-footer__contact-link"
                  itemProp="email"
                >
                  {email}
                </a>
              </div>
            )}

            <p className="ideai-footer__copyright">{copyright}</p>
          </div>

          {/* Middle: Navigation */}
          <div className="ideai-footer__column ideai-footer__column--middle">
            <nav aria-label="Footer navigation" role="navigation">
              <h2 className="ideai-footer__column-title">Navigation</h2>
              <ul className="ideai-footer__nav-list">
                {footerNav.map((item) => (
                  <li key={item.href} className="ideai-footer__nav-item">
                    <a href={item.href} className="ideai-footer__nav-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right: Social & Accounts */}
          <div className="ideai-footer__column ideai-footer__column--right">
            {/* Social Links */}
            <div className="ideai-footer__social">
              <h2 className="ideai-footer__column-title">Connect</h2>
              <ul className="ideai-footer__social-list">
                {socialLinks.map((link) => (
                  <li key={link.href} className="ideai-footer__social-item">
                    <a
                      href={link.href}
                      className="ideai-footer__social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label} (opens in new tab)`}
                    >
                      {link.icon && (
                        <span className="ideai-footer__social-icon" aria-hidden="true">
                          {link.icon}
                        </span>
                      )}
                      <span className="ideai-footer__social-label">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Links */}
            <nav aria-label="Account navigation" role="navigation">
              <h2 className="ideai-footer__column-title">Account</h2>
              <ul className="ideai-footer__accounts-list">
                {accountLinks.map((link) => (
                  <li key={link.href} className="ideai-footer__accounts-item">
                    <a href={link.href} className="ideai-footer__accounts-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
