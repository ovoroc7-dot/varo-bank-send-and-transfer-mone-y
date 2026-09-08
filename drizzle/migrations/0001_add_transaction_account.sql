ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS account text NOT NULL DEFAULT 'checking';