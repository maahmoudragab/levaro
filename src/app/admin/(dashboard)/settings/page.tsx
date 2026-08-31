import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/dashboard/settings/SettingsClient";

export const metadata = {
  title: "Settings | LÉVARO Admin",
};

/**
 * Admin Dashboard Settings Page (Server Component).
 * Renders simple initial store preferences and cache controls.
 */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SettingsClient adminEmail={user?.email || "admin@levaro.com"} />;
}
