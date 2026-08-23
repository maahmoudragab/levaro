"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/login/actionsLogs";

import {
  Settings,
  Package,
  LayoutGrid,
  Menu,
  X,
  CircleHelp,
  Tags,
  LogOut,
} from "lucide-react";


const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutGrid },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Mobile */}
      <header className="flex items-center justify-between bg-[#f7f8f9] p-4 lg:hidden">
        <h1 className="font-bodoni text-2xl font-extrabold text-primary">
          LÉVARO
        </h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="text-2xl text-[#334155]" />
        </button>
      </header>

      {/* overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Desktop*/}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col justify-between bg-[#f7f8f9] p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bodoni text-4xl font-extrabold text-primary">
                LÉVARO
              </h1>
              <p className="mt-1 text-xs font-bold tracking-[0.3em] text-[#334155] uppercase">
                Admin Dashboard
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden">
              <X className="text-2xl text-[#334155]" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-[#e5e5e5a3] text-primary font-semibold"
                      : "text-[#334155] hover:bg-gray-200/50 hover:text-black font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="text-lg" />
                    <span className="text-sm">{label}</span>
                  </div>
                  {isActive && (
                    <div className="h-7 w-1.25 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-12 space-y-3 pt-6">
          <Link
            href="/admin/support"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
              pathname === "/admin/support"
                ? "bg-[#e5e5e5a3] text-[#084d38] font-semibold"
                : "text-[#334155] hover:text-black font-medium"
            }`}
          >
            <div className="flex items-center gap-3">
              <CircleHelp className="text-lg" />
              <span className="text-sm">Support</span>
            </div>
          </Link>

          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-2.5 font-semibold text-[#c52828] hover:text-red-700"
          >
            <LogOut className="text-lg" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
