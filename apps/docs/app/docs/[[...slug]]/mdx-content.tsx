/**
 * @fileoverview Client component for rendering MDX content
 * 
 * @module MDXContent
 * @description
 * Client component wrapper for rendering Contentlayer MDX content.
 * Required because useMDXComponent is a React hook.
 */

"use client";

import { useMDXComponent } from "next-contentlayer/hooks";

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component />;
}

