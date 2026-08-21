"use client";

import { useRouter } from "next/navigation";
export default function ProductsPage({
  title,
  description,
  buttonName,
  ButtonAction,
}: {
  title: string;
  description: string;
  buttonName: string;
  ButtonAction?: () => void;
}) {
  const router = useRouter();
  return (
    <header className="flex flex-col gap-2 rounded-2xl bg-[#f7f8f9] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-bodoni text-2xl sm:text-3xl font-bold">{title}</h1>

        <p className="mt-1 text-xs sm:text-sm text-black/60">{description}</p>
      </div>

      <button
        type="button"
        className="cursor-pointer  rounded-xl  bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition duration-200"
        onClick={() => {
          if (buttonName == "Add New Product") {
           router.push("/admin/products/create");
          }
        }}
      >
        <span>{buttonName}</span>
      </button>
    </header>
  );
}
