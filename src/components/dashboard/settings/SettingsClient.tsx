"use client";

import { useState, useRef } from "react";
import {
  Store,
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Loader2,
  ShieldCheck,
  Save,
} from "lucide-react";
import { TopHeader } from "@/components/dashboard/categories/shared/TopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast";

interface SettingsClientProps {
  adminEmail?: string;
}

function getStoredSetting(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem("levaro_settings");
    if (saved) {
      const data = JSON.parse(saved);
      return data[key] ?? fallback;
    }
  } catch {
    // Ignore
  }
  return fallback;
}

export default function SettingsClient({
  adminEmail = "admin@levaro.com",
}: SettingsClientProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPurgingCache, setIsPurgingCache] = useState(false);

  // Simple Initial Defaults with lazy localStorage retrieval
  const [storeName, setStoreName] = useState(() =>
    getStoredSetting("storeName", "LÉVARO"),
  );
  const [currency, setCurrency] = useState(() =>
    getStoredSetting("currency", "EGP"),
  );
  const [supportEmail, setSupportEmail] = useState(() =>
    getStoredSetting("supportEmail", "concierge@levaro.com"),
  );
  const [supportPhone, setSupportPhone] = useState(() =>
    getStoredSetting("supportPhone", "+20 100 000 0000"),
  );
  const [skuPrefix, setSkuPrefix] = useState(() =>
    getStoredSetting("skuPrefix", "LEV"),
  );
  const [lowStockLimit, setLowStockLimit] = useState(() =>
    getStoredSetting("lowStockLimit", "10"),
  );
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(() =>
    getStoredSetting("freeShippingThreshold", "3000"),
  );

  const handlePurgeCache = async () => {
    try {
      setIsPurgingCache(true);
      const res = await fetch("/api/revalidate?tag=products&path=/admin/products");
      if (!res.ok) throw new Error("Failed to purge server cache");
      toast.success(
        "Cache Purged Successfully",
        "Next.js server cache has been cleared and fresh data reloaded.",
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cache purge failed";
      toast.error("Error", msg);
    } finally {
      setIsPurgingCache(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      storeName: storeName.trim() || "LÉVARO",
      currency,
      supportEmail: supportEmail.trim(),
      supportPhone: supportPhone.trim(),
      skuPrefix: skuPrefix.trim().toUpperCase() || "LEV",
      lowStockLimit,
      freeShippingThreshold,
    };

    try {
      localStorage.setItem("levaro_settings", JSON.stringify(payload));
    } catch {
      // Fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSaving(false);
    toast.success("Settings Saved", "Store preferences have been updated successfully.");
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 font-sans pb-16">
      {/* 1. Page TopHeader with Save action */}
      <TopHeader
        title="Settings"
        description="Manage brand identity, catalog presets, and server cache."
        buttonName="Save Settings"
        onButtonClick={() => formRef.current?.requestSubmit()}
      />

      <form ref={formRef} onSubmit={handleSaveSettings} className="space-y-4">
        {/* 2. Brand & Contact Information Card */}
        <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="font-bodoni text-lg sm:text-xl font-bold text-primary">
                Store Identity & Concierge
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Brand display name, primary currency, and official client support channels.
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Store className="size-4.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* Store Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Store Brand Name *
              </Label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs sm:text-sm font-medium focus-visible:bg-white shadow-2xs"
              />
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Store Base Currency *
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs sm:text-sm font-semibold shadow-2xs">
                  <SelectValue placeholder="Select Currency..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EGP" className="text-xs font-medium">
                    EGP - Egyptian Pound (ج.م)
                  </SelectItem>
                  <SelectItem value="USD" className="text-xs font-medium">
                    USD - US Dollar ($)
                  </SelectItem>
                  <SelectItem value="EUR" className="text-xs font-medium">
                    EUR - Euro (€)
                  </SelectItem>
                  <SelectItem value="AED" className="text-xs font-medium">
                    AED - UAE Dirham (د.إ)
                  </SelectItem>
                  <SelectItem value="SAR" className="text-xs font-medium">
                    SAR - Saudi Riyal (ر.س)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Support Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Mail className="size-3.5 text-zinc-400" />
                <span>Customer Care Email</span>
              </Label>
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs font-medium focus-visible:bg-white shadow-2xs"
              />
            </div>

            {/* Support Phone / WhatsApp */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Phone className="size-3.5 text-zinc-400" />
                <span>WhatsApp / Concierge Phone</span>
              </Label>
              <Input
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs font-medium focus-visible:bg-white shadow-2xs"
              />
            </div>
          </div>
        </section>

        {/* 3. Catalog & Inventory Defaults Card */}
        <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="font-bodoni text-lg sm:text-xl font-bold text-primary">
                Catalog & Stock Thresholds
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Automated SKU generation prefix, low stock alert limits, and delivery minimums.
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Sliders className="size-4.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {/* SKU Prefix */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Auto SKU Prefix
              </Label>
              <Input
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value.toUpperCase())}
                placeholder="LEV"
                className="h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs font-mono font-bold uppercase focus-visible:bg-white shadow-2xs"
              />
              <p className="text-[10px] text-zinc-400">
                Generated: {skuPrefix || "LEV"}-MEN-001
              </p>
            </div>

            {/* Low Stock Limit */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Low Stock Alert Limit
              </Label>
              <Input
                type="number"
                value={lowStockLimit}
                onChange={(e) => setLowStockLimit(e.target.value)}
                placeholder="10"
                className="h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs font-semibold focus-visible:bg-white shadow-2xs"
              />
              <p className="text-[10px] text-amber-600">
                Alerts when stock &le; {lowStockLimit || 10} units.
              </p>
            </div>

            {/* Free Shipping Threshold */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Free Shipping Minimum ({currency})
              </Label>
              <Input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                placeholder="3000"
                className="h-10 rounded-xl bg-[#f8f9fa] border-zinc-200 text-xs font-semibold focus-visible:bg-white shadow-2xs"
              />
              <p className="text-[10px] text-emerald-600">
                Complimentary delivery on &gt; {freeShippingThreshold || 3000} {currency}.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Performance & Cache Controls Card */}
        <section className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div>
              <h3 className="font-bodoni text-lg sm:text-xl font-bold text-primary">
                Performance & Cache
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Next.js server memory caching and manual purge controls.
              </p>
            </div>
            <Badge variant="active" className="h-6 px-2.5 text-xs font-semibold">
              <CheckCircle2 className="size-3 mr-1" />
              RAM Cache Active
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl border border-black/5 bg-[#fbfbfb]">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span>Flush Server Memory Cache</span>
              </p>
              <p className="text-[11px] text-zinc-500">
                Forces instant reloading of all products and category data.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handlePurgeCache}
              disabled={isPurgingCache}
              className="h-9.5 px-4 rounded-xl border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 shrink-0 shadow-2xs"
            >
              {isPurgingCache ? (
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
              ) : (
                <RotateCcw className="size-3.5 mr-1.5" />
              )}
              Purge Cache
            </Button>
          </div>

          {/* Admin Session Info */}
          <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="size-4 text-primary" />
              Signed in as: <strong className="font-mono text-zinc-800">{adminEmail}</strong>
            </span>
            <span className="text-[11px] text-zinc-400">
              Super Administrator
            </span>
          </div>
        </section>

        {/* 5. Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 px-6 rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            ) : (
              <Save className="size-3.5 mr-1.5" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
