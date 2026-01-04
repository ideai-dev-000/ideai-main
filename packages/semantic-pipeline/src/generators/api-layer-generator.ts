/**
 * @fileoverview API Layer Generator
 * @module @repo/semantic-pipeline/generators/api-layer-generator
 * @description
 * Generates type-safe API layer with caching, retries, and error handling.
 */

import type { APILayerConfig } from '../types';

/**
 * API Layer Generator
 */
export class APILayerGenerator {
  /**
   * Generate API layer
   */
  async generateAPILayer(
    library: string,
    endpoints: EndpointDefinition[]
  ): Promise<APILayerConfig> {
    const types = this.generateTypes(endpoints);
    const client = this.generateClient(endpoints);
    const hooks = this.generateHooks(endpoints, library);
    
    return {
      types,
      client,
      hooks,
      config: {
        baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
        timeout: 30000,
        retry: {
          maxRetries: 3,
          retryDelay: 1000,
        },
      },
    };
  }
  
  /**
   * Generate TypeScript types
   */
  private generateTypes(endpoints: EndpointDefinition[]): string {
    const types = endpoints.map((endpoint) => {
      return `export interface ${endpoint.name}Request {
  ${endpoint.requestParams.map((p) => `  ${p.name}: ${p.type};`).join('\n')}
}

export interface ${endpoint.name}Response {
  ${endpoint.responseFields.map((f) => `  ${f.name}: ${f.type};`).join('\n')}
}`;
    });
    
    return types.join('\n\n');
  }
  
  /**
   * Generate API client
   */
  private generateClient(endpoints: EndpointDefinition[]): string {
    const methods = endpoints.map((endpoint) => {
      return `  async ${endpoint.name}(params: ${endpoint.name}Request): Promise<${endpoint.name}Response> {
    const response = await fetch(\`\${this.baseURL}${endpoint.path}\`, {
      method: '${endpoint.method}',
      headers: { 'Content-Type': 'application/json' },
      ${endpoint.method !== 'GET' ? `body: JSON.stringify(params),` : ''}
    });
    
    if (!response.ok) {
      throw new Error(\`API Error: \${response.statusText}\`);
    }
    
    return response.json();
  }`;
    });
    
    return `class APIClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }
  
${methods.join('\n\n')}
}

export const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL || '/api');`;
  }
  
  /**
   * Generate React hooks
   */
  private generateHooks(
    endpoints: EndpointDefinition[],
    library: string
  ): string[] {
    if (library === 'react-query') {
      return endpoints.map((endpoint) => this.generateReactQueryHook(endpoint));
    }
    
    return endpoints.map((endpoint) => this.generateSWRHook(endpoint));
  }
  
  /**
   * Generate React Query hook
   */
  private generateReactQueryHook(endpoint: EndpointDefinition): string {
    return `export const use${endpoint.name} = (params: ${endpoint.name}Request) => {
  return useQuery({
    queryKey: ['${endpoint.name}', params],
    queryFn: () => apiClient.${endpoint.name}(params),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};`;
  }
  
  /**
   * Generate SWR hook
   */
  private generateSWRHook(endpoint: EndpointDefinition): string {
    return `export const use${endpoint.name} = (params: ${endpoint.name}Request) => {
  return useSWR(['${endpoint.name}', params], () => apiClient.${endpoint.name}(params));
};`;
  }
}

/**
 * Endpoint definition
 */
interface EndpointDefinition {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestParams: Array<{ name: string; type: string }>;
  responseFields: Array<{ name: string; type: string }>;
}

