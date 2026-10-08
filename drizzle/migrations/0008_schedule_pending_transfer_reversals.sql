-- lovable-cron-fallback-reviewed: User requested automatic reversals after 24 hours even while the app is closed; five-minute checks limit delay to five minutes.
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.reverse_all_expired_pending_transactions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_tx public.transactions%ROWTYPE;
  reversed_count integer := 0;
BEGIN
  FOR expired_tx IN
    UPDATE public.transactions AS tx
      SET status = 'reversed'
      WHERE tx.status = 'pending'
        AND tx.amount < 0
        AND tx.created_at <= now() - interval '24 hours'
      RETURNING tx.*
  LOOP
    INSERT INTO public.transactions (
      id, user_id, name, note, amount, fee, status, created_at, account, reversal_of
    ) VALUES (
      gen_random_uuid(),
      expired_tx.user_id,
      'Reversal — ' || expired_tx.name,
      'Automatic reversal: this demo payment was cancelled after 24 hours. The amount and fee were returned.',
      abs(expired_tx.amount) + expired_tx.fee,
      0,
      'completed',
      now(),
      expired_tx.account,
      expired_tx.id
    )
    ON CONFLICT (reversal_of) WHERE reversal_of IS NOT NULL DO NOTHING;

    reversed_count := reversed_count + 1;
  END LOOP;

  RETURN reversed_count;
END;
$$;

REVOKE ALL ON FUNCTION public.reverse_all_expired_pending_transactions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reverse_all_expired_pending_transactions() TO service_role;

DO $$
BEGIN
  PERFORM cron.schedule(
    'reverse-expired-demo-transfers',
    '*/5 * * * *',
    'SELECT public.reverse_all_expired_pending_transactions();'
  );
EXCEPTION
  WHEN unique_violation THEN
    NULL;
END;
$$;