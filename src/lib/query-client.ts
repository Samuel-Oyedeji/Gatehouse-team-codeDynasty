import { QueryClient } from "@tanstack/react-query";

// One QueryClient per browser session, but a fresh one per SSR request (queries
// only actually run on the client, so there's no server-side cache bleed).
// Sharing the browser instance lets non-hook mutation helpers in store.ts
// invalidate the same cache the QueryClientProvider reads from.
let browserClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return new QueryClient();
  }
  if (!browserClient) {
    browserClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 5_000, refetchOnWindowFocus: false } },
    });
  }
  return browserClient;
}

export const ESTATE_STATE_KEY = ["estate-state"] as const;
