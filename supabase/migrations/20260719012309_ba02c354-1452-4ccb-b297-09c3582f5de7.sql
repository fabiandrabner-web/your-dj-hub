
CREATE TABLE public.gigs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gigs TO anon, authenticated;
GRANT ALL ON public.gigs TO service_role;

ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gigs"
  ON public.gigs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed default events
INSERT INTO public.gigs (date, venue, city) VALUES
  ('2026-08-14', 'Sommerfest', 'Berlin'),
  ('2026-09-02', 'Schulparty', 'Hamburg'),
  ('2026-09-22', 'Jugendclub', 'München');
