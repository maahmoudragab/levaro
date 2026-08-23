import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  return (
    <header className="flex flex-col gap-2 rounded-2xl bg-[#f7f8f9] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-bodoni text-2xl sm:text-3xl font-bold text-primary">
          {title}
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-black/60">{description}</p>
      </div>
      <Link
        href={buttonName == "Add New Product" ? "/admin/products/create" : "#"}
      >
        <Button variant="default" onClick={ButtonAction}>
          {buttonName}
        </Button>
      </Link>
    </header>
  );
}
