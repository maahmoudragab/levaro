import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Password Recovery | LÉVARO Admin",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-100 p-4">
      <div className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        {/* Brand Header */}
        <div className="text-center space-y-1 mb-2">
          <h1 className="font-bodoni text-3xl font-extrabold text-primary">
            LÉVARO
          </h1>
          <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Admin Password Recovery
          </p>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed text-center">
          Enter your registered administrator email address to request credential recovery instructions.
        </p>

        <form className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="recovery-email" className="text-xs font-semibold text-zinc-700">
              Email Address
            </Label>
            <Input
              id="recovery-email"
              type="email"
              name="email"
              placeholder="admin@levaro.com"
              required
              className="rounded-xl bg-[#fbfbfb] text-sm"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary/90 transition-all"
          >
            Send Recovery Instructions
          </Button>
        </form>

        <div className="pt-2 text-center border-t border-black/5">
          <Link
            href="/admin/login"
            className="text-xs text-primary font-medium hover:underline"
          >
            &larr; Return to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}