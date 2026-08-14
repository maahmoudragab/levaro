import Link from "next/link";
import { login } from "@/app/admin/actionsLogs";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const hasError = params.error === "invalid_credentials";

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-zinc-200 font-sans">
      <form
        action={login}
        className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-white p-6 shadow-md"
      >
        <h1 className="text-center text-2xl font-bold">LÉVARO Admin</h1>
        <h3>maaahmoudragab@gmail.com</h3> <h3>123456</h3>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="rounded-md border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
        />
        {hasError && (
          <p className="rounded-md bg-red-100 p-3 text-center text-sm text-red-600">
            Invalid Email Or Password
          </p>
        )}
        <Link
          href="/admin/login/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot Password?
        </Link>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </main>
  );
}
