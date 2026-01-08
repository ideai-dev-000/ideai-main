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
import { Twitter, Github, Linkedin, Phone, Mail, MapPin } from "lucide-react";

interface FooterNavItem {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon?: "twitter" | "github" | "linkedin";
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
  copyright: copyrightProp,
  footerNav = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Documentation", href: "/docs" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  socialLinks = [
    {
      label: "Twitter",
      href: "https://twitter.com/ideai",
      icon: "twitter" as const,
    },
    {
      label: "GitHub",
      href: "https://github.com/ideai-dev-000",
      icon: "github" as const,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/ideai",
      icon: "linkedin" as const,
    },
  ],
  accountLinks = [
    { label: "Sign In", href: "/signin" },
    { label: "Sign Up", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
}: IdeAIFooterProps) => {
  // Use static year 2026 for SSR/client consistency (prevents hydration mismatch)
  // The year can be updated annually or passed via copyrightProp
  const currentYear = 2026;
  const copyright =
    copyrightProp ?? `© ${currentYear} IdeaI. All rights reserved.`;

  return (
    <footer
      className="ideai-footer"
      role="contentinfo"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="ideai-footer__container">
        {/* Three-Column Layout with Copyright in Same Row */}
        <div className="ideai-footer__columns">
          {/* Left: Logo Only */}
          <div className="ideai-footer__column ideai-footer__column--left">
            {/* Logo/Brand Area */}
            <div className="ideai-footer__brand">
              <IdeAILogo />
            </div>
          </div>

          {/* Middle: Copyright */}
          <div className="ideai-footer__column ideai-footer__column--middle">
            <p className="ideai-footer__copyright">{copyright}</p>
          </div>

          {/* Right: Social Icons, Phone & Email - All in One Row */}
          <div className="ideai-footer__column ideai-footer__column--right">
            <div className="ideai-footer__icons-row">
              {/* Social Links */}
              {socialLinks.map((link) => {
                const IconComponent =
                  link.icon === "twitter"
                    ? Twitter
                    : link.icon === "github"
                      ? Github
                      : link.icon === "linkedin"
                        ? Linkedin
                        : null;

                return IconComponent ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="ideai-footer__icon-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in new tab)`}
                    title={link.label}
                  >
                    <IconComponent
                      className="ideai-footer__icon"
                      size={18}
                      aria-hidden="true"
                    />
                  </a>
                ) : null;
              })}

              {/* Phone & Email */}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="ideai-footer__icon-link"
                  itemProp="telephone"
                  title={`Phone: ${phone}`}
                  aria-label={`Phone: ${phone}`}
                >
                  <Phone size={18} aria-hidden="true" />
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="ideai-footer__icon-link"
                  itemProp="email"
                  title={`Email: ${email}`}
                  aria-label={`Email: ${email}`}
                >
                  <Mail size={18} aria-hidden="true" />
                </a>
              )}

              {/* Address/Location */}
              {address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""} ${address.country || ""}`.trim(),
                  )}`}
                  className="ideai-footer__icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                  title={`Address: ${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""} ${address.country || ""}`.trim()}
                  aria-label={`Address: ${address.street || ""} ${address.city || ""} ${address.state || ""} ${address.zip || ""} ${address.country || ""}`.trim()}
                >
                  <MapPin size={18} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
