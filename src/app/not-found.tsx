import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found | LÉVARO",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-center font-sans">
      <div className="max-w-md space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
          Error 404
        </p>

        <h1 className="font-bodoni text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
          The garment or page you are looking for does not exist, has been retired, or is temporarily unavailable.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
