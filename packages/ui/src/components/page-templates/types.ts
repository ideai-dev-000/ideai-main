/**
 * @fileoverview Page Template Types
 * 
 * @module PageTemplateTypes
 * @description
 * TypeScript types for page template system
 */

export type TemplateType = 
  | "dashboard"
  | "blog"
  | "social"
  | "shop"
  | "landing"
  | "portfolio"
  | "docs"
  | "admin";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  category: string;
  tags: string[];
  preview: string; // Preview image URL or description
  config: {
    layout: string;
    sections: string[];
    components: string[];
    features: string[];
  };
}

export interface PageTemplatesData {
  templates: PageTemplate[];
}

