import { ParcelWingError, type ParcelWingApiErrorPayload } from "../errors";
import type {
  ApiErrorShape,
  DeletionResponse,
  ListResponse,
  ResourceResponse,
} from "../types";
import { trimTrailingSlash } from "./url";

export type ParcelWingClientOptions = {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: typeof globalThis.fetch;
  headers?: Record<string, string>;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export class HttpClient {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly fetch: typeof globalThis.fetch;
  readonly headers: Record<string, string>;

  constructor(options: ParcelWingClientOptions) {
    if (!options.apiKey?.trim()) {
      throw new Error("ParcelWing client requires a non-empty apiKey.");
    }

    this.apiKey = options.apiKey.trim();
    this.baseUrl = trimTrailingSlash(options.baseUrl || "https://parcelwing.com");
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.fetch = options.fetch ?? globalThis.fetch;
    this.headers = options.headers ?? {};

    if (!this.fetch) {
      throw new Error(
        "No fetch implementation available. Pass a fetch option or use Node.js 18.17+.",
      );
    }
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    if (options.signal) {
      options.signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }

    try {
      const response = await this.fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "X-ParcelWing-SDK": "nodejs/0.1.0",
          ...(options.body === undefined
            ? {}
            : { "Content-Type": "application/json" }),
          ...this.headers,
          ...(options.headers ?? {}),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });

      const text = await response.text();
      const json = text ? safeJsonParse(text) : null;

      if (!response.ok) {
        throw toParcelWingError(response.status, json, text);
      }

      return json as T;
    } catch (error) {
      if (error instanceof ParcelWingError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ParcelWingError({
          status: 408,
          type: "api_error",
          code: "request_timeout",
          message: `Request timed out after ${this.timeoutMs}ms.`,
        });
      }

      if (error instanceof Error) {
        throw new ParcelWingError({
          status: 0,
          type: "api_error",
          code: "network_error",
          message: error.message,
        });
      }

      throw new ParcelWingError({
        status: 0,
        type: "api_error",
        code: "unknown_error",
        message: "Unknown Parcel Wing SDK error.",
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  unwrapResource<TObject extends string, TData>(
    response: ResourceResponse<TObject, TData>,
  ) {
    return response.data;
  }

  unwrapList<T>(response: ListResponse<T>) {
    return response;
  }

  unwrapDeletion<TObject extends string>(response: DeletionResponse<TObject>) {
    return response;
  }
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toParcelWingError(status: number, json: unknown, fallbackText: string) {
  const payload = json as ParcelWingApiErrorPayload | ApiErrorShape | null;

  if (payload?.error?.message) {
    const { type, code, message, details, request_id, ...metadata } = payload.error;

    return new ParcelWingError({
      status,
      type: (type ?? "api_error") as ParcelWingError["type"],
      code,
      message,
      requestId: request_id,
      details,
      metadata,
    });
  }

  return new ParcelWingError({
    status,
    type: "api_error",
    code: "http_error",
    message: fallbackText || `Parcel Wing API request failed with status ${status}.`,
  });
}
