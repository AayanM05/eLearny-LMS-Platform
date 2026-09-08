// Typed fetch wrapper for the Spring Boot API (/api/v1/...)

import type { ApiErrorResponse } from '@elearny/types';

export class ApiClient {
  private baseUrl: string;
  private tokenGetter?: () => string | null;

  constructor(baseUrl: string, tokenGetter?: () => string | null) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.tokenGetter = tokenGetter;
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.tokenGetter ? this.tokenGetter() : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: ApiErrorResponse;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = {
            timestamp: new Date().toISOString(),
            status: response.status,
            error: 'HTTP_ERROR',
            message: response.statusText || 'An unexpected server error occurred',
            path: endpoint,
          };
        }
        throw errorBody;
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw {
          timestamp: new Date().toISOString(),
          status: 408,
          error: 'REQUEST_TIMEOUT',
          message: 'Server response timed out (backend may be sleeping or unreachable). Try Instant Demo login below.',
          path: endpoint,
        };
      }
      throw err;
    }
  }
}

