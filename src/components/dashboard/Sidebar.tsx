"use client";

import { logout } from "@/app/admin/login/actionsLogs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiCog, HiCube, HiViewGrid, HiMenu, HiX } from "react-icons/hi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdCategory, MdLogout } from "react-icons/md";

const navItems = [
  { label: "Overview", href: "/admin", icon: HiViewGrid },
  { label: "Products", href: "/admin/products", icon: HiCube },
  { label: "Categories", href: "/admin/categories", icon: MdCategory },
  { label: "Settings", href: "/admin/settings", icon: HiCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Mobile */}
      <header className="flex items-center justify-between border-b border-gray-200/80 bg-[#f7f8f9] px-4 py-4 lg:hidden">
        <h1 className="font-bodoni text-2xl font-extrabold text-primary">
          LÉVARO
        </h1>
        <button onClick={() => setIsOpen(true)}>
          <HiMenu className="text-2xl text-[#334155]" />
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-64 flex-col justify-between bg-[#f7f8f9] p-6 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:border-r lg:border-gray-200/80 lg:shadow-none lg:min-h-[calc(100vh-80px)] ${
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
              <HiX className="text-2xl text-[#334155]" />
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
                    <div className="h-7 w-[5px] rounded-full bg-primary" />
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
              <IoMdHelpCircleOutline className="text-lg" />
              <span className="text-sm">Support</span>
            </div>
            {pathname === "/admin/support" && (
              <div className="h-6 w-1 rounded-full bg-[#084d38]" />
            )}
          </Link>

          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-2.5 font-semibold text-[#c52828] hover:text-red-700"
          >
            <MdLogout className="text-lg" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
