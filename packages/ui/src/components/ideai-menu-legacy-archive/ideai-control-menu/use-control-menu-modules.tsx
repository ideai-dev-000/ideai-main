/**
 * @fileoverview Control Menu Module Registration System
 *
 * @module ControlMenuModules
 * @description
 * Hook and utilities for dynamically registering service control UIs
 * with the IdeaI Control Menu.
 */

"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { IdeAIControlSection } from "../ideai-control-menu";

export interface ControlMenuModule {
  /** Unique module ID */
  id: string;
  /** Module title (shown in section header) */
  title: string;
  /** Module control UI component */
  component: ReactNode;
  /** Section order (lower numbers appear first) */
  order?: number;
  /** Whether section is open by default */
  defaultOpen?: boolean;
  /** Whether this module is completed (for step-based flows) */
  isCompleted?: boolean;
  /** Auto-open next module when this one completes */
  autoOpenNext?: boolean;
}

interface ControlMenuModulesContextValue {
  modules: ControlMenuModule[];
  registerModule: (module: ControlMenuModule) => void;
  unregisterModule: (id: string) => void;
  updateModule: (id: string, updates: Partial<ControlMenuModule>) => void;
}

const ControlMenuModulesContext =
  React.createContext<ControlMenuModulesContextValue | null>(null);

/**
 * Hook to access control menu module registration
 */
export function useControlMenuModules() {
  const context = React.useContext(ControlMenuModulesContext);
  if (!context) {
    throw new Error(
      "useControlMenuModules must be used within ControlMenuModulesProvider",
    );
  }
  return context;
}

/**
 * Provider for control menu module registration
 */
export function ControlMenuModulesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modules, setModules] = React.useState<ControlMenuModule[]>([]);

  const registerModule = React.useCallback((module: ControlMenuModule) => {
    setModules((prev) => {
      // Remove existing module with same ID
      const filtered = prev.filter((m) => m.id !== module.id);
      // Add new module and sort by order
      return [...filtered, module].sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
    });
  }, []);

  const unregisterModule = React.useCallback((id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateModule = React.useCallback(
    (id: string, updates: Partial<ControlMenuModule>) => {
      setModules((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      );
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      modules,
      registerModule,
      unregisterModule,
      updateModule,
    }),
    [modules, registerModule, unregisterModule, updateModule],
  );

  return (
    <ControlMenuModulesContext.Provider value={value}>
      {children}
    </ControlMenuModulesContext.Provider>
  );
}

/**
 * Component that renders all registered modules as sections
 */
export function ControlMenuModulesRenderer() {
  const { modules } = useControlMenuModules();

  return (
    <>
      {modules.map((module) => (
        <IdeAIControlSection
          key={module.id}
          id={module.id}
          title={module.title}
          defaultOpen={module.defaultOpen}
          isCompleted={module.isCompleted}
          autoOpenNext={module.autoOpenNext}
        >
          {module.component}
        </IdeAIControlSection>
      ))}
    </>
  );
}

/**
 * Hook for services to register their control UI
 *
 * @example
 * ```tsx
 * function MyService() {
 *   const { registerModule, unregisterModule } = useControlMenuModules();
 *
 *   useEffect(() => {
 *     registerModule({
 *       id: "my-service",
 *       title: "My Service",
 *       component: <MyServiceControls />,
 *       order: 1,
 *     });
 *
 *     return () => unregisterModule("my-service");
 *   }, [registerModule, unregisterModule]);
 * }
 * ```
 */
export function useRegisterControlModule(module: ControlMenuModule) {
  const { registerModule, unregisterModule, updateModule } =
    useControlMenuModules();

  React.useEffect(() => {
    registerModule(module);
    return () => unregisterModule(module.id);
  }, [module.id, registerModule, unregisterModule]);

  // Update module when props change
  React.useEffect(() => {
    updateModule(module.id, module);
  }, [module, updateModule]);
}
