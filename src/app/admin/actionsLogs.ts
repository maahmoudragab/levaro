"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export const login = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?error=invalid_credentials");
  }

  redirect("/admin");
};

export const handleLogout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
};
