
ALTER TABLE public.gigs
  ADD COLUMN IF NOT EXISTS time text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS location_info text,
  ADD COLUMN IF NOT EXISTS location_link text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','past'));
