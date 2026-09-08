import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/app/admin/login/actions";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

/**
 * Admin Login Page component.
 * Authenticates administrators and gates access to the dashboard.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();

  // If already authenticated, redirect directly to dashboard
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  const params = await searchParams;
  const hasError = params.error === "invalid_credentials";

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-100 p-4">
      <form
        action={login}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
      >
        {/* Brand Header */}
        <div className="text-center space-y-1 mb-2">
          <h1 className="font-bodoni text-3xl font-extrabold text-primary">
            LÉVARO
          </h1>
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Admin Portal
          </p>
        </div>

        {/* Credentials Form */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-zinc-700">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="admin@levaro.com"
            required
            className="rounded-xl bg-[#fbfbfb] text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-zinc-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="rounded-xl bg-[#fbfbfb] text-sm"
          />
        </div>

        {/* Error Notification */}
        {hasError && (
          <p className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-center text-xs font-medium text-red-600">
            Invalid email or password. Please try again.
          </p>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end">
          <Link
            href="/admin/login/forgot-password"
            className="text-xs text-primary hover:underline medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="mt-2 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition-all"
        >
          Sign In to Dashboard
        </Button>
      </form>
    </main>
  );
}
