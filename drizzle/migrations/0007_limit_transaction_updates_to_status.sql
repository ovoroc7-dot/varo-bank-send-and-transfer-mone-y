REVOKE UPDATE ON public.transactions FROM authenticated;
GRANT UPDATE (status) ON public.transactions TO authenticated;