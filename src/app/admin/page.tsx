import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { handleLogout } from "@/app/admin/actionsLogs";

export default async function AdminPage() {
  const supabase = await createClient();

  // بنجيب المستخدم الحالي من Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // لو مفيش User → يرجعه للـ Login
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main>
      <h1>LÉVARO Admin Dashboard</h1>

      <p>Welcome, {user.email}</p>

      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
