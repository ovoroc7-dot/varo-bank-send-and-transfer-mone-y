CREATE TABLE public.linked_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('card','bank')),
  name text NOT NULL,
  last4 text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.linked_accounts TO authenticated;
GRANT ALL ON public.linked_accounts TO service_role;
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.linked_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.linked_accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.linked_accounts FOR DELETE TO authenticated USING (auth.uid() = user_id);