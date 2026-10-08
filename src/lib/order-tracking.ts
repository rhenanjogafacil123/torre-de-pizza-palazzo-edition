import type { CartItem } from "@/hooks/useCart";

type TrackArgs = {
  items: CartItem[];
  subtotal: number;
  notes?: string;
  paymentMethod?: string;
  cashAmount?: number | null;
};

/**
 * Intentionally disabled.
 *
 * The previous implementation wrote directly from the browser to a Supabase
 * table using the public anonymous role. That made the analytics endpoint easy
 * to spam and allowed untrusted clients to submit arbitrary tracking payloads.
 *
 * Checkout does not depend on this telemetry, so the safest default is to keep
 * it disabled until tracking is reintroduced behind a validated, rate-limited
 * server endpoint.
 */
export function trackWhatsappOrderClick(_args: TrackArgs): Promise<void> {
  return Promise.resolve();
}
