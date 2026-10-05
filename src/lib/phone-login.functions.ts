import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const digits = (s: string) => s.replace(/\D/g, "").slice(-10);

// Signs in with the phone number used at signup. The matching email never
// leaves the server; only the resulting session is returned.
export const loginWithPhone = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ phone: z.string().min(7).max(20), password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const target = digits(data.phone);
    if (target.length !== 10) return { error: "Enter a valid 10-digit phone number." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let email: string | null = null;
    for (let page = 1; page <= 50 && !email; page++) {
      const { data: res, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) return { error: "Login is unavailable right now. Try again." };
      for (const u of res.users) {
        const p = (u.user_metadata?.phone as string | undefined) ?? u.phone ?? "";
        if (p && digits(p) === target) {
          email = u.email ?? null;
          break;
        }
      }
      if (res.users.length < 1000) break;
    }
    const invalid = { error: "Invalid login credentials" };
    if (!email) return invalid;
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: s, error } = await client.auth.signInWithPassword({ email, password: data.password });
    if (error || !s.session) return { error: error?.message ?? invalid.error };
    return {
      error: null,
      access_token: s.session.access_token,
      refresh_token: s.session.refresh_token,
    };
  });
