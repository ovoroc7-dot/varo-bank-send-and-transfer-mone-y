CREATE OR REPLACE FUNCTION public.email_for_phone(_phone text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.email::text
  FROM auth.users u
  WHERE length(regexp_replace(coalesce(_phone,''), '\D', '', 'g')) >= 10
    AND right(regexp_replace(coalesce(u.raw_user_meta_data->>'phone', u.phone, ''), '\D', '', 'g'), 10)
      = right(regexp_replace(_phone, '\D', '', 'g'), 10)
  ORDER BY u.created_at
  LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.email_for_phone(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_for_phone(text) TO anon, authenticated;