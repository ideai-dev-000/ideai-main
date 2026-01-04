/**
 * @fileoverview State Management Generator
 * @module @repo/semantic-pipeline/generators/state-management-generator
 * @description
 * Generates state management setup based on selected library and component relationships.
 */

import type { StateManagementSetup, StoreStructure } from '../types';

/**
 * State Management Generator
 */
export class StateManagementGenerator {
  /**
   * Generate state management setup
   */
  async generateStateManagement(
    library: string,
    domains: string[]
  ): Promise<StateManagementSetup> {
    const slices = domains.map((domain) => this.generateSlice(domain, library));
    
    return {
      library,
      store: {
        slices,
        middleware: this.generateMiddleware(library),
        devtools: { enabled: true, name: 'AppStore' },
      },
      hooks: this.generateHooks(slices),
      persistence: {
        enabled: true,
        storageKey: 'app-state',
        persistedKeys: domains,
      },
    };
  }
  
  /**
   * Generate store slice
   */
  private generateSlice(domain: string, library: string): StoreStructure['slices'][0] {
    if (library === 'zustand') {
      return {
        name: domain,
        code: this.generateZustandSlice(domain),
        stateShape: {
          [`${domain.toLowerCase()}Data`]: null,
          loading: false,
          error: null,
        },
        actions: [
          `set${domain}Data`,
          'setLoading',
          'setError',
          `fetch${domain}Data`,
        ],
      };
    }
    
    // Default to zustand
    return this.generateSlice(domain, 'zustand');
  }
  
  /**
   * Generate Zustand slice
   */
  private generateZustandSlice(domain: string): string {
    const domainLower = domain.toLowerCase();
    
    return `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const use${domain}Store = create(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        ${domainLower}Data: null,
        loading: false,
        error: null,
        
        // Actions
        set${domain}Data: (data) => set({ ${domainLower}Data: data }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        
        // Async action
        fetch${domain}Data: async (params) => {
          set({ loading: true, error: null });
          try {
            const response = await fetch(\`/api/${domainLower}\`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            set({ ${domainLower}Data: data, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
      })),
      {
        name: '${domainLower}-store',
        partialize: (state) => ({ ${domainLower}Data: state.${domainLower}Data }),
      }
    ),
    { name: '${domain}Store' }
  )
);

// Selector hooks
export const use${domain}Data = () => use${domain}Store((state) => state.${domainLower}Data);
export const use${domain}Loading = () => use${domain}Store((state) => state.loading);
export const use${domain}Error = () => use${domain}Store((state) => state.error);`;
  }
  
  /**
   * Generate middleware
   */
  private generateMiddleware(library: string): string[] {
    if (library === 'zustand') {
      return ['devtools', 'persist', 'immer'];
    }
    return [];
  }
  
  /**
   * Generate hooks
   */
  private generateHooks(
    slices: StoreStructure['slices']
  ): string[] {
    return slices.flatMap((slice) => [
      `use${slice.name}Data`,
      `use${slice.name}Loading`,
      `use${slice.name}Error`,
    ]);
  }
}

