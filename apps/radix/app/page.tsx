/**
 * @fileoverview Radix UI page - Unstyled, accessible primitives showcase
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { UF } from "@repo/ui/components/uf";
import * as Separator from "@radix-ui/react-separator";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "radix";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /radix"
      subtitle="Radix UI - Unstyled, Accessible Primitives"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="radix">Open alert</IdeaIButton>}
    >
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        <IdeAICSSSummary
          frameworks={["Radix UI Primitives", "Tailwind CSS", "IdeaI Design System"]}
          description="Radix UI provides unstyled, accessible component primitives. You style them yourself with CSS or Tailwind. Perfect for building custom design systems."
        />

        {/* UF - Universal Framework Component by IdeaI */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            UF by IdeaI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Hot-toggle between all CSS frameworks available in the IdeaI monorepo. Pure HTML with dynamic CSS injection.
          </p>
          <UF defaultFramework="radix" />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Radix UI Primitives</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            All components are unstyled primitives - fully accessible and customizable.
          </p>
        </section>

        {/* Button Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Button</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Default
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Outline
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Secondary
            </button>
            <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
              Disabled
            </button>
          </div>
        </section>

        <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Separator Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Separator</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Horizontal separator:</p>
              <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="flex gap-4 h-20">
              <p>Vertical separator:</p>
              <Separator.Root orientation="vertical" className="w-px bg-slate-200 dark:bg-slate-700" />
              <p>Content on the right</p>
            </div>
          </div>
        </section>

        <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Tooltip Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Tooltip</h3>
          <div className="flex flex-wrap gap-4">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                    Hover me
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded shadow-lg"
                    sideOffset={5}
                  >
                    This is a tooltip
                    <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-100" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                    Another tooltip
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded shadow-lg"
                    sideOffset={5}
                  >
                    Tooltips provide additional context
                    <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-100" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </section>

        <Separator.Root className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Dialog Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Dialog</h3>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Open Dialog
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xl max-w-md w-full">
                <Dialog.Title className="text-xl font-bold mb-2">Dialog Title</Dialog.Title>
                <Dialog.Description className="text-slate-600 dark:text-slate-400 mb-4">
                  This is a dialog built with Radix UI primitives. It's fully accessible and unstyled by default.
                </Dialog.Description>
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Confirm
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </section>
      </div>
    </IdeAIPageTemplate>
  );
}

