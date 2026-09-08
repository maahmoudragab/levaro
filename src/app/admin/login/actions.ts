"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Action: Authenticate admin user with email and password.
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect("/admin/login?error=invalid_credentials");
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

/**
 * Server Action: Sign out admin user and invalidate cached admin layout.
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear cached admin layouts to ensure immediate lock out
  revalidatePath("/", "layout");
  redirect("/admin/login");
}