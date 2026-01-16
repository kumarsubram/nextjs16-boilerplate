/**
 * API Client
 *
 * A typed fetch wrapper with:
 * - Automatic JSON parsing
 * - Error handling
 * - Timeout support
 * - Request/response interceptors
 * - Retry logic
 */

import { ApiException } from "./errors";

export interface RequestConfig extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  defaultTimeout?: number;
  onRequest?: (url: string, config: RequestConfig) => RequestConfig;
  onResponse?: <T>(response: T) => T;
  onError?: (error: ApiException) => void;
}

export function createApiClient(config: ApiClientConfig) {
  const {
    baseUrl,
    defaultHeaders = {},
    defaultTimeout = 30000,
    onRequest,
    onResponse,
    onError,
  } = config;

  async function request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint}`;

    let requestConfig: RequestConfig = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
        ...options.headers,
      },
      timeout: options.timeout ?? defaultTimeout,
    };

    // Apply request interceptor
    if (onRequest) {
      requestConfig = onRequest(url, requestConfig);
    }

    // Handle body serialization
    const fetchOptions: RequestInit = {
      ...requestConfig,
      body: requestConfig.body ? JSON.stringify(requestConfig.body) : undefined,
    };

    // Retry logic
    const maxRetries = options.retries ?? 0;
    const retryDelay = options.retryDelay ?? 1000;
    let lastError: ApiException | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetchWithTimeout(
          url,
          fetchOptions,
          requestConfig.timeout!
        );

        // Handle non-OK responses
        if (!response.ok) {
          const body = await parseResponseBody(response);
          throw ApiException.fromResponse(response, body);
        }

        // Parse successful response
        let data = await parseResponseBody(response);

        // Apply response interceptor
        if (onResponse) {
          data = onResponse(data);
        }

        return data as T;
      } catch (error) {
        if (error instanceof ApiException) {
          lastError = error;

          // Don't retry client errors (4xx)
          if (error.status && error.status >= 400 && error.status < 500) {
            break;
          }
        } else if (error instanceof Error) {
          if (error.name === "AbortError") {
            lastError = ApiException.timeout();
          } else {
            lastError = ApiException.networkError(error);
          }
        }

        // Wait before retry (except on last attempt)
        if (attempt < maxRetries) {
          await sleep(retryDelay * (attempt + 1)); // Exponential backoff
        }
      }
    }

    // Call error handler
    if (onError && lastError) {
      onError(lastError);
    }

    throw lastError;
  }

  return {
    get: <T>(endpoint: string, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: "POST", body }),

    put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: "PUT", body }),

    patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: "PATCH", body }),

    delete: <T>(endpoint: string, config?: RequestConfig) =>
      request<T>(endpoint, { ...config, method: "DELETE" }),

    request,
  };
}

// Helper: Fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Helper: Parse response body
async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  // Try to parse as JSON anyway
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Helper: Sleep
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
