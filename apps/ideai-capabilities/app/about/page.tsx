/**
 * @fileoverview About page - Lists technologies and tools used by IdeaI
 *
 * @module AboutPage
 * @description
 * About page that displays information about the technologies and tools
 * that power IdeaI Workflow and the IdeaI platform.
 */

import Link from "next/link";
import { ExternalLink } from "lucide-react";

const technologies = [
  {
    name: "Workflow",
    description:
      "A powerful workflow engine for building and executing automated workflows with visual node-based editing.",
    url: "https://useworkflow.dev/",
    category: "Workflow Engine",
  },
  {
    name: "AI SDK",
    description:
      "The Vercel AI SDK provides a unified interface for working with AI models, making it easy to integrate AI capabilities into applications.",
    url: "https://ai-sdk.dev/",
    category: "AI Framework",
  },
  {
    name: "AI Gateway",
    description:
      "Vercel AI Gateway provides a unified API for accessing multiple AI providers with rate limiting, caching, and analytics.",
    url: "https://vercel.com/ai-gateway",
    category: "AI Infrastructure",
  },
  {
    name: "AI Elements",
    description:
      "Pre-built React components for AI-powered user interfaces, including chat interfaces, streaming text, and more.",
    url: "https://ai-sdk.dev/elements",
    category: "UI Components",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">About IdeaI</h1>
        <p className="text-muted-foreground text-lg">
          IdeaI is built on top of powerful open-source technologies and tools
          that enable modern AI-powered workflows.
        </p>
      </div>

      <div className="space-y-6">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="group rounded-lg border border-border bg-background p-6 transition-all hover:border-primary hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{tech.name}</h2>
                  <span className="text-muted-foreground rounded-full bg-muted px-2 py-0.5 text-xs">
                    {tech.category}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tech.description}
                </p>
              </div>
              <Link
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-1 transition-colors"
              >
                <span className="text-sm">Visit</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6">
        <h3 className="mb-2 text-lg font-semibold">Built with Modern Tools</h3>
        <p className="text-muted-foreground text-sm">
          IdeaI leverages cutting-edge technologies to provide a seamless
          workflow building experience. Each tool in our stack is carefully
          chosen for its reliability, performance, and developer experience.
        </p>
      </div>
    </div>
  );
}
