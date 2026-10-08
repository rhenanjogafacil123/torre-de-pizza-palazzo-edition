-- Security hardening for order_clicks.
-- Checkout does not depend on this table. Keep browser/anonymous roles locked out
-- until telemetry is reintroduced behind a validated, rate-limited server endpoint.

DROP POLICY IF EXISTS "Anyone can log an order click" ON public.order_clicks;

REVOKE ALL PRIVILEGES ON TABLE public.order_clicks FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.order_clicks FROM authenticated;

ALTER TABLE public.order_clicks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_clicks
  DROP CONSTRAINT IF EXISTS order_clicks_items_array_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_items_count_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_subtotal_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_cash_amount_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_payment_method_len_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_notes_len_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_source_len_chk,
  DROP CONSTRAINT IF EXISTS order_clicks_page_url_len_chk;

ALTER TABLE public.order_clicks
  ADD CONSTRAINT order_clicks_items_array_chk
    CHECK (jsonb_typeof(items) = 'array' AND jsonb_array_length(items) <= 50),
  ADD CONSTRAINT order_clicks_items_count_chk
    CHECK (items_count BETWEEN 0 AND 100),
  ADD CONSTRAINT order_clicks_subtotal_chk
    CHECK (subtotal BETWEEN 0 AND 100000),
  ADD CONSTRAINT order_clicks_cash_amount_chk
    CHECK (cash_amount IS NULL OR cash_amount BETWEEN 0 AND 1000000),
  ADD CONSTRAINT order_clicks_payment_method_len_chk
    CHECK (payment_method IS NULL OR char_length(payment_method) <= 50),
  ADD CONSTRAINT order_clicks_notes_len_chk
    CHECK (notes IS NULL OR char_length(notes) <= 500),
  ADD CONSTRAINT order_clicks_source_len_chk
    CHECK (char_length(source) <= 50),
  ADD CONSTRAINT order_clicks_page_url_len_chk
    CHECK (page_url IS NULL OR char_length(page_url) <= 2048);

COMMENT ON TABLE public.order_clicks IS
  'Telemetry table locked to privileged server-side access; no anonymous or authenticated client writes.';
