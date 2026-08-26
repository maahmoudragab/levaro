import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin / Server client for administrative operations (Storage uploads, Product operations).
 * Uses SUPABASE_SERVICE_ROLE_KEY if defined (bypasses RLS on the server),
 * or falls back to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createSupabaseClient(supabaseUrl, serviceRoleKey || publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
