/**
 * @fileoverview IdeaI Menu Context
 *
 * @module IdeAIMenuContext
 * @description
 * React context for menu state management and section coordination
 */

"use client";

import * as React from "react";
import type { IdeAIMenuContextValue } from "./types";

export const IdeAIMenuContext =
  React.createContext<IdeAIMenuContextValue | null>(null);

export function useIdeAIMenuContext() {
  const context = React.useContext(IdeAIMenuContext);
  if (!context) {
    throw new Error("Menu section must be used within an IdeAI Menu component");
  }
  return context;
}

/**
 * Create menu context value with section management
 */
export function useMenuContextValue() {
  const [sections, setSections] = React.useState<
    Map<
      string,
      { isOpen: boolean; isCompleted: boolean; autoOpenNext?: boolean }
    >
  >(new Map());

  const setSectionOpen = React.useCallback((id: string, open: boolean) => {
    setSections((prev) => {
      const current = prev.get(id);
      if (current && current.isOpen === open) {
        return prev; // No change needed
      }
      const next = new Map(prev);
      const sectionData = current || { isOpen: false, isCompleted: false };
      next.set(id, { ...sectionData, isOpen: open });
      return next;
    });
  }, []);

  const setSectionCompleted = React.useCallback(
    (id: string, completed: boolean) => {
      setSections((prev) => {
        const next = new Map(prev);
        const current = next.get(id) || { isOpen: false, isCompleted: false };
        const updated = { ...current, isCompleted: completed };

        next.set(id, updated);

        // Auto-open next section if this one is completed and has autoOpenNext
        if (completed && current.autoOpenNext) {
          // Find next section in DOM order
          const sectionElements = Array.from(
            document.querySelectorAll("[data-section-id]") || [],
          );
          const currentIndex = sectionElements.findIndex(
            (el) => el.getAttribute("data-section-id") === id,
          );
          if (currentIndex >= 0 && currentIndex < sectionElements.length - 1) {
            const nextSectionId =
              sectionElements[currentIndex + 1]?.getAttribute(
                "data-section-id",
              );
            if (nextSectionId) {
              const nextSection = next.get(nextSectionId);
              if (nextSection && !nextSection.isOpen) {
                next.set(nextSectionId, { ...nextSection, isOpen: true });
              }
            }
          }
        }

        return next;
      });
    },
    [],
  );

  const registeredSectionsRef = React.useRef<Map<string, boolean | undefined>>(
    new Map(),
  );

  const registerSection = React.useCallback(
    (id: string, autoOpenNext?: boolean) => {
      if (
        !registeredSectionsRef.current ||
        !(registeredSectionsRef.current instanceof Map)
      ) {
        registeredSectionsRef.current = new Map<string, boolean | undefined>();
      }

      const existingAutoOpenNext = registeredSectionsRef.current.get(id);
      if (existingAutoOpenNext === autoOpenNext) {
        return; // Already registered with same values
      }

      registeredSectionsRef.current.set(id, autoOpenNext);

      setSections((prev) => {
        const current = prev.get(id);
        if (!current) {
          const next = new Map(prev);
          next.set(id, {
            isOpen: false,
            isCompleted: false,
            autoOpenNext,
          });
          return next;
        } else if (
          autoOpenNext !== undefined &&
          current.autoOpenNext !== autoOpenNext
        ) {
          const next = new Map(prev);
          next.set(id, { ...current, autoOpenNext });
          return next;
        }
        return prev; // No changes needed
      });
    },
    [],
  );

  const contextValue: IdeAIMenuContextValue = React.useMemo(
    () => ({
      sections: new Map(
        Array.from(sections.entries()).map(([id, { isOpen, isCompleted }]) => [
          id,
          { isOpen, isCompleted },
        ]),
      ),
      setSectionOpen,
      setSectionCompleted,
      registerSection,
    }),
    [sections, setSectionOpen, setSectionCompleted, registerSection],
  );

  return contextValue;
}
