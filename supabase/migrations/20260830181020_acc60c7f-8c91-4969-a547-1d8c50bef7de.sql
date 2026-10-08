CREATE TABLE public.order_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  items_count INTEGER NOT NULL DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  cash_amount NUMERIC(10,2),
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'whatsapp_checkout',
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX order_clicks_clicked_at_idx ON public.order_clicks (clicked_at DESC);

GRANT INSERT ON public.order_clicks TO anon;
GRANT INSERT ON public.order_clicks TO authenticated;
GRANT ALL ON public.order_clicks TO service_role;

ALTER TABLE public.order_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log an order click"
ON public.order_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);