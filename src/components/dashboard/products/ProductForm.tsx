"use client";

import {
  useState,
  useTransition,
  useMemo,
  type FormEvent,
  type ChangeEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  ImagePlus,
  Loader2,
  Minus,
  Plus,
  Shirt,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "@/lib/toast";

import {
  createProduct,
  updateProduct,
  uploadProductImage,
  type CreateProductInput,
  type UpdateProductInput,
  type Product,
  type StockItem,
} from "@/app/services/admin/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  GENDERS,
  BRANDS,
  PRODUCT_TYPES,
  FITS,
  COLORS,
  MATERIALS,
  ORIGINS,
  PRESET_SIZES,
  PRESET_TAGS,
  type CategoryOption,
} from "@/components/dashboard/products/product-utils";

/* -------------------------------------------------------------------------- */
/* Constants & Limit Configurations                                           */
/* -------------------------------------------------------------------------- */

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB limit per image file
const LOW_STOCK_LIMIT = 10;
const MAX_TAGS = 6;

export type ProductFormProps = {
  categories: CategoryOption[];
  initialProductCount?: number;
  initialProduct?: (Product & { images?: string[] }) | null;
  initialProductId?: string;
  mode?: "create" | "edit";
};

type ImageItem = {
  id: string;
  url: string;
  file?: File;
};

/* -------------------------------------------------------------------------- */
/* Utility Helpers & Multilingual Slugify                                     */
/* -------------------------------------------------------------------------- */

const ARABIC_CAT_MAP: Record<string, string> = {
  رجال: "MEN",
  رجالي: "MEN",
  نساء: "WOM",
  نسائي: "WOM",
  حريمي: "WOM",
  اطفال: "KID",
  أطفال: "KID",
  اكسسوارات: "ACC",
  إكسسوارات: "ACC",
  احذية: "SHO",
  أحذية: "SHO",
  ملابس: "APP",
  جديد: "NEW",
};

/**
 * Converts a string (multilingual: Arabic, English, etc.) to a clean URL-safe slug format.
 */
const slugify = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/* -------------------------------------------------------------------------- */
/* Main Component: Unified Product Form (Create / Edit)                       */
/* -------------------------------------------------------------------------- */

/**
 * Full-featured product creation and editing form.
 * Handles staging images locally, stock adjustments, pricing calculations,
 * SKU/Slug auto-generation, and deferred upload to Supabase on form submit.
 */
export function ProductForm({
  categories,
  initialProductCount = 0,
  initialProduct = null,
  initialProductId,
  mode = "create",
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = mode === "edit" && Boolean(initialProduct);

  const [productId] = useState(
    () => initialProduct?.id ?? initialProductId ?? "prod-000000",
  );

  // Determine initial parent category vs collection
  const initialCategoryObj = useMemo(() => {
    return categories.find((c) => c.id === initialProduct?.category_id);
  }, [categories, initialProduct]);

  const [selectedParentId, setSelectedParentId] = useState<string>(() => {
    if (!initialCategoryObj) return "";
    return initialCategoryObj.parent_id || initialCategoryObj.id;
  });

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(() => {
    if (!initialCategoryObj) return "";
    return initialCategoryObj.parent_id ? initialCategoryObj.id : "";
  });

  // 1. General & Attribute Form Fields State
  const [form, setForm] = useState({
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    brand: initialProduct?.brand ?? "",
    category_id: initialProduct?.category_id ?? "",
    gender: initialProduct?.gender ?? "",
    product_type: initialProduct?.product_type ?? "",
    fit: initialProduct?.fit ?? "",
    color: initialProduct?.color ?? "",
    material: initialProduct?.material ?? "",
    country_of_origin: initialProduct?.country_of_origin ?? "",
    short_description: initialProduct?.short_description ?? "",
    description: initialProduct?.description ?? "",
    price: initialProduct?.price ? String(initialProduct.price) : "",
    sale_price: initialProduct?.sale_price
      ? String(initialProduct.sale_price)
      : "",
    is_active: initialProduct?.is_active ?? true,
    is_featured: initialProduct?.is_featured ?? false,
    is_new: initialProduct?.is_new ?? false,
  });

  // 2. Stock Items & Media State
  const [stock, setStock] = useState<StockItem[]>(initialProduct?.stock ?? []);
  const [images, setImages] = useState<ImageItem[]>(() => {
    return (initialProduct?.images ?? []).map((u, i) => ({
      id: `existing-${i}-${u}`,
      url: u,
    }));
  });
  const [customSize, setCustomSize] = useState({ name: "", qty: "10" });
  const [imageUrl, setImageUrl] = useState("");
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  // 3. Tags & Collections State
  const initialTags = useMemo(() => {
    if (!initialProduct?.tags) return [];
    if (Array.isArray(initialProduct.tags))
      return initialProduct.tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (typeof initialProduct.tags === "string") {
      return (initialProduct.tags as string)
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }
    return [];
  }, [initialProduct]);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [customTagInput, setCustomTagInput] = useState("");
  const [availablePresetTags, setAvailablePresetTags] = useState<string[]>(() => {
    const presetLower = PRESET_TAGS.map((t) => t.toLowerCase());
    return Array.from(new Set([...presetLower, ...initialTags]));
  });

  const toggleTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (selectedTags.includes(normalizedTag)) {
      setSelectedTags((prev) => prev.filter((t) => t !== normalizedTag));
    } else {
      if (selectedTags.length >= MAX_TAGS) {
        toast.warning(
          "Tag Limit Reached",
          `You can select a maximum of ${MAX_TAGS} tags per product.`,
        );
        return;
      }
      setSelectedTags((prev) => [...prev, normalizedTag]);
    }
  };

  const addCustomTag = () => {
    const trimmed = customTagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (selectedTags.includes(trimmed)) {
      setCustomTagInput("");
      return;
    }
    if (selectedTags.length >= MAX_TAGS) {
      toast.warning(
        "Tag Limit Reached",
        `You can select a maximum of ${MAX_TAGS} tags per product.`,
      );
      return;
    }
    setSelectedTags((prev) => [...prev, trimmed]);
    if (!availablePresetTags.includes(trimmed)) {
      setAvailablePresetTags((prev) => [...prev, trimmed]);
    }
    setCustomTagInput("");
  };

  const removeTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    setSelectedTags((prev) => prev.filter((t) => t !== normalizedTag));
  };

  // 4. Discount Calculations State
  const [discountType, setDiscountType] = useState<
    "none" | "percentage" | "fixed"
  >(() => {
    return initialProduct?.sale_price && initialProduct.price
      ? "fixed"
      : "none";
  });
  const [discountValue, setDiscountValue] = useState(() => {
    return initialProduct?.sale_price && initialProduct.price
      ? String(initialProduct.price - initialProduct.sale_price)
      : "";
  });

  // Helper: Update single form field
  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Available parent categories (all categories)
  const availableParentCategories = useMemo(() => {
    return categories.filter((c) => !c.parent_id);
  }, [categories]);

  // Available collections under the selected parent category (all collections, including inactive)
  const availableCollections = useMemo(() => {
    if (!selectedParentId) return [];
    return categories.filter((c) => c.parent_id === selectedParentId);
  }, [categories, selectedParentId]);

  // Handle parent category selection change
  const handleParentCategoryChange = (parentId: string) => {
    setSelectedParentId(parentId);
    setSelectedCollectionId("");
    updateField("category_id", parentId);
  };

  // Handle collection selection change
  const handleCollectionChange = (collectionId: string) => {
    if (collectionId === "none") {
      setSelectedCollectionId("");
      updateField("category_id", selectedParentId);
    } else {
      setSelectedCollectionId(collectionId);
      updateField("category_id", collectionId);
    }
  };

  const selectedCategory = categories.find((c) => c.id === form.category_id);
  const selectedCategoryName = selectedCategory?.name;

  // Compute 3-letter category code for SKU generator
  const categoryCode = useMemo(() => {
    if (!selectedCategory) return "GEN";

    if (selectedCategory.slug) {
      const cleanSlug = selectedCategory.slug
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase();
      if (cleanSlug.length >= 2) return cleanSlug;
    }

    const latinName = selectedCategory.name
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 3)
      .toUpperCase();
    if (latinName.length >= 2) return latinName;

    const trimmedName = selectedCategory.name.trim();
    for (const [arKey, code] of Object.entries(ARABIC_CAT_MAP)) {
      if (trimmedName.includes(arKey)) {
        return code;
      }
    }

    return "CAT";
  }, [selectedCategory]);

  const sku =
    isEdit && initialProduct?.sku && form.category_id === initialProduct.category_id
      ? initialProduct.sku
      : `LEV-${categoryCode}-${String(initialProductCount + 1).padStart(3, "0")}`;

  const shortId = useMemo(
    () => productId.replace(/-/g, "").slice(-6),
    [productId],
  );

  const currentSlug = useMemo(() => {
    const cleanName = slugify(form.name);
    return cleanName ? `${cleanName}-${shortId}` : "";
  }, [form.name, shortId]);

  const handleNameChange = (val: string) => {
    updateField("name", val);
    const clean = slugify(val);
    updateField("slug", clean ? `${clean}-${shortId}` : "");
  };

  const numPrice = Number(form.price) || 0;
  const numSale = useMemo(() => {
    if (numPrice <= 0 || discountType === "none") return null;
    if (discountType === "percentage") {
      const pct = Math.min(100, Math.max(0, Number(discountValue) || 0));
      return pct > 0 ? Math.max(0, numPrice - (numPrice * pct) / 100) : null;
    }
    const fixed = Math.max(0, Number(discountValue) || 0);
    return fixed > 0 && fixed < numPrice ? numPrice - fixed : null;
  }, [numPrice, discountType, discountValue]);

  const discountPercent = numSale
    ? Math.round(((numPrice - numSale) / numPrice) * 100)
    : 0;
  const totalStock = stock.reduce((acc, cur) => acc + (cur.stock || 0), 0);

  const addSize = (sizeName: string, qty = 10) => {
    const s = sizeName.trim();
    if (!s || stock.some((i) => i.size.toLowerCase() === s.toLowerCase()))
      return;
    setStock((prev) => [...prev, { size: s, stock: qty }]);
    setCustomSize({ name: "", qty: "10" });
  };

  const updateQty = (index: number, delta: number) => {
    setStock((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item,
      ),
    );
  };

  const removeSize = (index: number) => {
    setStock((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= MAX_IMAGES) {
      toast.error(
        "Image Limit Reached",
        `You can only attach up to ${MAX_IMAGES} photos per product.`,
      );
      return;
    }

    const available = MAX_IMAGES - images.length;
    const toProcess = Array.from(files).slice(0, available);
    const newItems: ImageItem[] = [];

    for (const file of toProcess) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          "File Too Large",
          `"${file.name}" exceeds the 1MB file size limit.`,
        );
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `file-${Date.now()}-${Math.random()}`,
        url: previewUrl,
        file,
      });
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      toast.success(
        "Photos Added",
        `Added ${newItems.length} photo(s) to the gallery.`,
      );
    }

    e.target.value = "";
  };

  const addUrlImage = () => {
    const u = imageUrl.trim();
    if (!u || images.length >= MAX_IMAGES) return;
    if (!u.startsWith("http")) {
      toast.error(
        "Invalid Image URL",
        "Please provide a valid URL starting with http:// or https://",
      );
      return;
    }
    setImages((prev) => [...prev, { id: `url-${Date.now()}`, url: u }]);
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    const target = images[index];
    if (target?.file && target.url.startsWith("blob:")) {
      URL.revokeObjectURL(target.url);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const isDirty = useMemo(() => {
    if (!isEdit || !initialProduct) return true;

    const nameChanged = form.name.trim() !== (initialProduct.name ?? "");
    const brandChanged =
      form.brand.trim() !== (initialProduct.brand ?? "");
    const catChanged =
      form.category_id !== (initialProduct.category_id ?? "");
    const genderChanged =
      form.gender !== (initialProduct.gender ?? "");
    const typeChanged =
      form.product_type !== (initialProduct.product_type ?? "");
    const fitChanged = form.fit !== (initialProduct.fit ?? "");
    const colorChanged = form.color !== (initialProduct.color ?? "");
    const materialChanged =
      form.material !== (initialProduct.material ?? "");
    const originChanged =
      form.country_of_origin !== (initialProduct.country_of_origin ?? "");
    const shortDescChanged =
      form.short_description.trim() !==
      (initialProduct.short_description ?? "");
    const descChanged =
      form.description.trim() !== (initialProduct.description ?? "");
    const priceChanged = numPrice !== Number(initialProduct.price ?? 0);
    const saleChanged = numSale !== (initialProduct.sale_price ?? null);
    const activeChanged =
      form.is_active !== Boolean(initialProduct.is_active);
    const featuredChanged =
      form.is_featured !== Boolean(initialProduct.is_featured);
    const newChanged = form.is_new !== Boolean(initialProduct.is_new);

    const initialStockStr = JSON.stringify(initialProduct.stock ?? []);
    const currentStockStr = JSON.stringify(stock);
    const stockChanged = initialStockStr !== currentStockStr;

    const initialImages = initialProduct.images ?? [];
    const imagesChanged =
      images.length !== initialImages.length ||
      images.some((img, idx) => img.file || img.url !== initialImages[idx]);

    const tagsChanged =
      selectedTags.length !== initialTags.length ||
      selectedTags.some((t) => !initialTags.includes(t));

    return (
      nameChanged ||
      brandChanged ||
      catChanged ||
      genderChanged ||
      typeChanged ||
      fitChanged ||
      colorChanged ||
      materialChanged ||
      originChanged ||
      shortDescChanged ||
      descChanged ||
      priceChanged ||
      saleChanged ||
      activeChanged ||
      featuredChanged ||
      newChanged ||
      stockChanged ||
      imagesChanged ||
      tagsChanged
    );
  }, [
    isEdit,
    initialProduct,
    form,
    numPrice,
    numSale,
    stock,
    images,
    selectedTags,
    initialTags,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isPending) return;

    if (isEdit && !isDirty) {
      toast.info(
        "No Changes Detected",
        "You haven't made any edits to this product yet.",
      );
      return;
    }

    if (!form.name.trim())
      return toast.error("Missing Field", "Product Title is required.");
    const finalSlug = form.slug.trim() || currentSlug;
    if (!finalSlug)
      return toast.error("Slug Error", "Could not generate a unique URL slug.");
    if (!form.category_id)
      return toast.error("Missing Field", "Please select a category.");
    if (!form.gender)
      return toast.error("Missing Field", "Please select a target gender.");
    if (!form.product_type)
      return toast.error("Missing Field", "Please specify the product type.");
    if (!form.fit)
      return toast.error("Missing Field", "Please select a fit style.");
    if (!form.color)
      return toast.error("Missing Field", "Please select a primary color.");
    if (!form.material)
      return toast.error("Missing Field", "Please specify the fabric or material.");
    if (!form.country_of_origin)
      return toast.error("Missing Field", "Please select the country of origin.");
    if (numPrice <= 0)
      return toast.error("Invalid Price", "Base price must be greater than 0.");
    if (images.length === 0)
      return toast.error("Missing Images", "At least one product photo is required.");
    if (stock.length === 0)
      return toast.error(
        "Missing Inventory",
        "At least one size with available stock is required.",
      );

    startTransition(async () => {
      try {
        const finalImageUrls: string[] = [];

        for (let i = 0; i < images.length; i++) {
          const item = images[i];
          if (item.file) {
            const fd = new FormData();
            fd.append("file", item.file);
            fd.append("productId", productId);
            fd.append("index", String(i));
            const res = await uploadProductImage(fd);
            if (res?.url) {
              finalImageUrls.push(res.url);
            }
          } else {
            finalImageUrls.push(item.url);
          }
        }

        const payload: CreateProductInput = {
          id: productId,
          name: form.name.trim(),
          slug: finalSlug,
          brand: form.brand.trim() || null,
          category_id: form.category_id,
          gender: form.gender,
          product_type: form.product_type,
          fit: form.fit,
          color: form.color,
          material: form.material,
          country_of_origin: form.country_of_origin,
          short_description: form.short_description.trim() || null,
          description: form.description.trim() || null,
          price: numPrice,
          sale_price: numSale,
          sku: sku,
          is_active: form.is_active,
          is_featured: form.is_featured,
          is_new: form.is_new,
          tags: selectedTags.map((t) => t.trim().toLowerCase()),
          stock: stock,
          images: finalImageUrls,
        };

        if (isEdit && initialProduct) {
          await updateProduct(initialProduct.id, payload as UpdateProductInput);
          toast.success(
            "Product Updated",
            "Product changes have been saved successfully.",
          );
        } else {
          await createProduct(payload);
          toast.success(
            "Product Created",
            "New luxury piece has been published to the catalog.",
          );
        }

        router.push("/admin/products");
        router.refresh();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Error saving product.";
        toast.error("Saving Failed", msg);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 font-sans w-full">
      {/* 1. Header Toolbar */}
      <header className="flex flex-col gap-3 rounded-2xl bg-[#f7f8f9] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between border border-black/5 shadow-2xs">
        <div>
          <h1 className="font-bodoni text-2xl sm:text-3xl font-bold tracking-tight text-primary">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
            {isEdit
              ? "Modify catalog product details, stock, and photography."
              : "Add a new luxury fashion piece to your catalog."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={isPending}
            className="h-9.5 rounded-xl border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
          >
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending || (isEdit && !isDirty)}
            onClick={handleSubmit}
            className={cn(
              "h-9.5 rounded-xl bg-primary px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98]",
              isEdit &&
                !isDirty &&
                "opacity-40 cursor-not-allowed bg-zinc-400 hover:bg-zinc-400",
            )}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 size-4" />
            )}
            {isEdit ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </header>

      {/* 2. Main Form Grid */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 lg:grid-cols-12"
      >
        {/* Left Column (7 Cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* General Information Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              General Information
            </h2>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Product Title *
              </Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Minimalist Cotton Overshirt"
                className="rounded-xl bg-[#fbfbfb] text-sm focus:border-primary focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-zinc-700">
                    URL Slug (Auto) *
                  </Label>
                  <span className="text-[10px] font-medium text-zinc-400">
                    Auto-generated from title
                  </span>
                </div>
                <Input
                  value={form.slug || currentSlug}
                  readOnly
                  disabled
                  placeholder="Auto-generated from title"
                  className="rounded-xl bg-zinc-100 text-xs font-medium text-zinc-500 cursor-not-allowed border-black/5 select-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-zinc-700">
                    SKU Code (Auto) *
                  </Label>
                  <span className="text-[10px] font-semibold text-primary">
                    Category: {categoryCode}
                  </span>
                </div>
                <Input
                  value={sku}
                  readOnly
                  disabled
                  className="rounded-xl bg-zinc-100 text-xs font-mono font-bold uppercase text-zinc-600 cursor-not-allowed border-black/5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Brand / Line
                </Label>
                <Select
                  value={form.brand}
                  onValueChange={(v) => updateField("brand", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Brand..." />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b} className="text-xs">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Short Summary
                </Label>
                <Input
                  value={form.short_description}
                  onChange={(e) =>
                    updateField("short_description", e.target.value)
                  }
                  placeholder="One-line summary for cards"
                  className="rounded-xl bg-[#fbfbfb] text-xs focus:border-primary focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Full Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Product story, fabric details, sizing notes..."
                className="min-h-20 rounded-xl bg-[#fbfbfb] text-xs focus:border-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Attributes & Classification Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Attributes & Classification
            </h2>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Main Category *
                </Label>
                <Select
                  value={selectedParentId}
                  onValueChange={handleParentCategoryChange}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Main Category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParentCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-zinc-700">
                    Collection / Line
                  </Label>
                  <span className="text-[10px] text-zinc-400">
                    {availableCollections.length > 0 ? `${availableCollections.length} available` : "Optional"}
                  </span>
                </div>
                <Select
                  value={selectedCollectionId || "none"}
                  onValueChange={handleCollectionChange}
                  disabled={!selectedParentId || availableCollections.length === 0}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder={
                      !selectedParentId
                        ? "Select category first..."
                        : availableCollections.length === 0
                          ? "No sub-collections (General)"
                          : "Select Collection..."
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs text-zinc-500">
                      None (General Category Item)
                    </SelectItem>
                    {availableCollections.map((col) => (
                      <SelectItem key={col.id} value={col.id} className="text-xs">
                        <div className="flex items-center justify-between gap-3 w-full">
                          <span>{col.name}</span>
                          {!col.is_active && (
                            <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-md font-medium">
                              Inactive
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Target Gender *
                </Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => updateField("gender", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Gender..." />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Product Type *
                </Label>
                <Select
                  value={form.product_type}
                  onValueChange={(v) => updateField("product_type", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Fit *
                </Label>
                <Select
                  value={form.fit}
                  onValueChange={(v) => updateField("fit", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Fit..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FITS.map((f) => (
                      <SelectItem key={f} value={f} className="text-xs">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Primary Color *
                </Label>
                <Select
                  value={form.color}
                  onValueChange={(v) => updateField("color", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <div className="flex items-center gap-2 truncate">
                      {form.color && (
                        <span
                          className="size-2.5 rounded-full border border-black/10 shrink-0"
                          style={{
                            backgroundColor:
                              COLORS.find((c) => c.name === form.color)?.hex ||
                              "#000",
                          }}
                        />
                      )}
                      <SelectValue placeholder="Select Color..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {COLORS.map((c) => (
                      <SelectItem
                        key={c.name}
                        value={c.name}
                        className="text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Fabric / Material *
                </Label>
                <Select
                  value={form.material}
                  onValueChange={(v) => updateField("material", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Material..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((m) => (
                      <SelectItem key={m} value={m} className="text-xs">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold text-zinc-700">
                  Country of Origin *
                </Label>
                <Select
                  value={form.country_of_origin}
                  onValueChange={(v) => updateField("country_of_origin", v)}
                >
                  <SelectTrigger className="w-full rounded-xl bg-[#fbfbfb] text-xs">
                    <SelectValue placeholder="Select Origin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ORIGINS.map((o) => (
                      <SelectItem key={o} value={o} className="text-xs">
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tags & Collections Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                  Tags & Collections
                </h2>
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  selectedTags.length >= MAX_TAGS
                    ? "text-amber-600 font-bold"
                    : "text-zinc-400 font-medium"
                )}
              >
                {selectedTags.length}/{MAX_TAGS} selected
              </span>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#fbfbfb] border border-black/5">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-semibold"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full p-0.5 hover:bg-primary/20 text-primary/70 hover:text-primary transition-colors"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                disabled={selectedTags.length >= MAX_TAGS}
                placeholder={
                  selectedTags.length >= MAX_TAGS
                    ? `Maximum ${MAX_TAGS} tags limit reached`
                    : "Type custom tag (e.g. Vintage, Summer, Silk)..."
                }
                className={cn(
                  "rounded-xl text-xs",
                  selectedTags.length >= MAX_TAGS
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-black/5"
                    : "bg-[#fbfbfb] focus:border-primary focus:bg-white"
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomTag}
                disabled={!customTagInput.trim() || selectedTags.length >= MAX_TAGS}
                className="rounded-xl text-xs shrink-0 font-semibold"
              >
                <Plus className="size-3.5 mr-1" />
                Add Tag
              </Button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-zinc-500">
                  Suggested Options:
                </p>
                {selectedTags.length >= MAX_TAGS && (
                  <span className="text-[10px] text-amber-600 font-medium">
                    (Limit reached — remove a tag to select another)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availablePresetTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                        isSelected
                          ? "bg-primary text-white shadow-2xs"
                          : selectedTags.length >= MAX_TAGS
                            ? "bg-zinc-100/60 text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      )}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Media & Photography Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                Media & Photography *
              </h2>
              <span className="text-xs text-zinc-500 font-medium tabular-nums">
                {images.length}/{MAX_IMAGES} uploaded
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label
                className={cn(
                  "flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 text-xs font-medium transition-colors",
                  images.length >= MAX_IMAGES
                    ? "opacity-50 cursor-not-allowed border-black/10 text-zinc-400"
                    : "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10",
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  disabled={images.length >= MAX_IMAGES}
                  className="hidden"
                />
                <Upload className="size-3.5" />
                <span>Select Photos (≤1MB)</span>
              </label>

              <div className="flex flex-1 items-center gap-1.5">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="h-8 rounded-xl bg-[#fbfbfb] text-xs focus:border-primary focus:bg-white"
                  disabled={images.length >= MAX_IMAGES}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUrlImage}
                  disabled={!imageUrl.trim() || images.length >= MAX_IMAGES}
                  className="h-8 rounded-xl text-xs text-primary border-primary/30 hover:bg-primary/5"
                >
                  Add URL
                </Button>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 pt-1">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="group relative aspect-3/4 overflow-hidden rounded-xl border border-black/10 bg-zinc-50"
                  >
                    <Image
                      src={img.url}
                      alt="Product"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white">
                        COVER
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsCover(i)}
                          className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-zinc-900"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="rounded bg-red-600 p-1 text-white hover:bg-red-700"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/10 py-5 text-zinc-400 text-xs">
                <ImagePlus className="size-5 text-primary/40" />
                <p className="mt-1">At least 1 product image is required.</p>
              </div>
            )}
          </div>

          {/* Sizes & Inventory Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                Sizes & Inventory *
              </h2>
              <span className="text-xs font-semibold text-primary tabular-nums">
                {totalStock} Total Units
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-zinc-400">Quick:</span>
              <button
                type="button"
                onClick={() => PRESET_SIZES.forEach((s) => addSize(s, 15))}
                className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-0.5 font-medium text-primary hover:bg-primary/10"
              >
                Add XS-3XL
              </button>
              <button
                type="button"
                onClick={() => addSize("One Size", 20)}
                className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-0.5 font-medium text-primary hover:bg-primary/10"
              >
                One Size
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Input
                value={customSize.name}
                onChange={(e) =>
                  setCustomSize((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Size name (e.g. 4XL)..."
                className="h-8 rounded-xl bg-[#fbfbfb] text-xs focus:border-primary focus:bg-white"
              />
              <Input
                type="number"
                min="0"
                value={customSize.qty}
                onChange={(e) =>
                  setCustomSize((p) => ({ ...p, qty: e.target.value }))
                }
                placeholder="Qty"
                className="h-8 w-20 rounded-xl bg-[#fbfbfb] text-xs focus:border-primary focus:bg-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addSize(customSize.name, Number(customSize.qty) || 10)
                }
                disabled={!customSize.name.trim()}
                className="h-8 rounded-xl text-xs text-primary border-primary/30 hover:bg-primary/5"
              >
                <Plus className="size-3 mr-1" /> Add
              </Button>
            </div>

            {stock.length > 0 ? (
              <div className="divide-y divide-black/5 rounded-xl border border-black/10 bg-[#fbfbfb] overflow-hidden">
                {stock.map((item, idx) => (
                  <div
                    key={`${item.size}-${idx}`}
                    className="flex items-center justify-between p-2.5 text-xs"
                  >
                    <span className="font-bold text-zinc-900 w-16">
                      {item.size}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQty(idx, -1)}
                        className="size-6 flex items-center justify-center rounded-lg border border-black/10 bg-white text-zinc-700 hover:bg-zinc-50"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, 1)}
                        className="size-6 flex items-center justify-center rounded-lg border border-black/10 bg-white text-zinc-700 hover:bg-zinc-50"
                      >
                        <Plus className="size-3" />
                      </button>
                      <span
                        className={cn(
                          "w-24 text-right text-[11px] font-medium",
                          item.stock === 0
                            ? "text-red-500"
                            : item.stock <= LOW_STOCK_LIMIT
                              ? "text-amber-600"
                              : "text-primary",
                        )}
                      >
                        {item.stock === 0
                          ? "Out of stock"
                          : item.stock <= LOW_STOCK_LIMIT
                            ? `Low (${item.stock})`
                            : `In stock (${item.stock})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSize(idx)}
                        className="ml-2 text-zinc-400 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-3 text-center text-xs text-zinc-400">
                At least one size is required.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (5 Cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Status & Visibility Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Status & Visibility
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                  Active (Visible)
                </p>
                <p className="text-xs text-zinc-400">
                  Display in customer storefront
                </p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => updateField("is_active", v)}
              />
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                  Featured Product
                </p>
                <p className="text-xs text-zinc-400">
                  Show in featured collections
                </p>
              </div>
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => updateField("is_featured", v)}
              />
            </div>

            <div className="h-px bg-black/5" />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-semibold text-zinc-800">
                  New Arrival Flag
                </p>
                <Switch
                  checked={form.is_new}
                  onCheckedChange={(v) => updateField("is_new", v)}
                />
              </div>
              <p className="text-xs text-primary bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                Notice: New Arrival items automatically rank first in store catalog.
              </p>
            </div>
          </div>

          {/* Pricing & Discounts Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Pricing & Discounts
            </h2>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Base Price (EGP) *
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="0.00"
                className="h-10 rounded-xl border-zinc-200/90 bg-white text-xs sm:text-sm text-zinc-900 font-semibold shadow-2xs focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Discount Type
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["none", "percentage", "fixed"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setDiscountType(t);
                      if (t === "none") setDiscountValue("");
                      else if (!discountValue)
                        setDiscountValue(t === "percentage" ? "20" : "100");
                    }}
                    className={cn(
                      "h-9 rounded-xl border text-xs font-medium transition-all capitalize",
                      discountType === t
                        ? "border-primary bg-primary text-white font-semibold shadow-xs"
                        : "border-zinc-200/80 bg-zinc-50/50 text-zinc-600 hover:bg-white",
                    )}
                  >
                    {t === "none"
                      ? "None"
                      : t === "percentage"
                        ? "Percent (%)"
                        : "Fixed (EGP)"}
                  </button>
                ))}
              </div>
            </div>

            {discountType !== "none" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  {discountType === "percentage"
                    ? "Discount Percentage (%)"
                    : "Discount Amount (EGP)"}
                </Label>
                <Input
                  type="number"
                  min="0"
                  max={discountType === "percentage" ? 100 : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="h-10 rounded-xl border-zinc-200/90 bg-white text-xs sm:text-sm shadow-2xs focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            )}

            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Original Price:</span>
                <span className="font-semibold tabular-nums">
                  {numPrice > 0 ? `${numPrice.toFixed(2)} EGP` : "—"}
                </span>
              </div>
              {numSale !== null && (
                <div className="flex justify-between text-primary font-medium">
                  <span>Discount:</span>
                  <span className="font-semibold tabular-nums">-{discountPercent}%</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-zinc-900 pt-1.5 border-t border-primary/10">
                <span>Final Price:</span>
                <span className="text-primary text-sm tabular-nums">
                  {numSale !== null
                    ? `${numSale.toFixed(2)} EGP`
                    : numPrice > 0
                      ? `${numPrice.toFixed(2)} EGP`
                      : "— EGP"}
                </span>
              </div>
            </div>
          </div>

          {/* Live Storefront Preview Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Eye className="size-3.5" />
                <span>Storefront Live Preview</span>
              </div>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500">
                {sku}
              </span>
            </div>

            {/* Main Product Card Preview */}
            <div className="group overflow-hidden rounded-xl border border-black/10 bg-[#fafafa] shadow-xs transition-all duration-300 hover:shadow-md">
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                {images.length > 0 ? (
                  <Image
                    src={images[previewImageIndex]?.url ?? images[0].url}
                    alt={form.name || "Product preview"}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 p-4 text-center text-zinc-400">
                    <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200/60">
                      <Shirt className="size-5 stroke-[1.5] text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-600">No Image Uploaded</p>
                      <p className="text-[10px] text-zinc-400">Upload photos to preview live</p>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {form.is_new && (
                    <span className="rounded-full bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold tracking-wider text-white shadow-xs">
                      NEW
                    </span>
                  )}
                  {numSale !== null && (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[8px] font-bold tracking-wider text-white shadow-xs">
                      -{discountPercent}%
                    </span>
                  )}
                  {form.is_featured && (
                    <span className="rounded-full bg-amber-500/95 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold tracking-wider text-white shadow-xs">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Status */}
                <div className="absolute top-2 right-2 z-10">
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-semibold backdrop-blur-md shadow-xs",
                      form.is_active
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/20"
                        : "bg-zinc-900/80 text-zinc-400 border border-white/10"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1 rounded-full",
                        form.is_active ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                      )}
                    />
                    {form.is_active ? "Active" : "Draft"}
                  </span>
                </div>

                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-semibold text-white">
                    {previewImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Gallery Thumbnails Carousel */}
              {images.length > 1 && (
                <div className="flex items-center gap-1.5 p-1.5 bg-white/90 border-b border-black/5 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setPreviewImageIndex(idx)}
                      className={cn(
                        "relative size-8 shrink-0 overflow-hidden rounded-md border transition-all",
                        previewImageIndex === idx
                          ? "border-primary ring-1.5 ring-primary/20 scale-105"
                          : "border-black/10 opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumb ${idx + 1}`}
                        fill
                        className="object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="p-3 space-y-1.5 bg-white">
                <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-primary/80">
                  <span>{form.brand || "LÉVARO"}</span>
                  {selectedCategoryName && (
                    <span className="text-zinc-400 font-normal">
                      {selectedCategoryName}
                    </span>
                  )}
                </div>

                <h3 className="font-bodoni text-sm font-bold text-zinc-900 leading-tight line-clamp-1">
                  {form.name || "Untitled Luxury Product"}
                </h3>

                <div className="flex flex-wrap items-center gap-1 text-[9px] text-zinc-500">
                  {form.fit && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium">
                      {form.fit}
                    </span>
                  )}
                  {form.color && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium">
                      {form.color}
                    </span>
                  )}
                  {form.material && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium">
                      {form.material}
                    </span>
                  )}
                </div>

                {stock.length > 0 && (
                  <div className="space-y-0.5 pt-0.5">
                    <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Sizes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {stock.map((item) => (
                        <span
                          key={item.size}
                          className={cn(
                            "rounded border px-1 py-0.2 text-[9px] font-semibold",
                            item.stock > 0
                              ? "border-black/10 bg-zinc-50 text-zinc-800"
                              : "border-zinc-200 bg-zinc-100/50 text-zinc-400 line-through"
                          )}
                        >
                          {item.size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-1.5 border-t border-black/5">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bodoni text-sm font-bold text-primary">
                        {numSale !== null
                          ? `${numSale.toFixed(2)} EGP`
                          : numPrice > 0
                            ? `${numPrice.toFixed(2)} EGP`
                            : "0.00 EGP"}
                      </span>
                      {numSale !== null && numPrice > 0 && (
                        <span className="text-[10px] text-zinc-400 line-through">
                          {numPrice.toFixed(2)} EGP
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                        totalStock === 0
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : totalStock <= 5
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1 rounded-full",
                          totalStock === 0
                            ? "bg-rose-500"
                            : totalStock <= 5
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        )}
                      />
                      {totalStock === 0
                        ? "Out of Stock"
                        : totalStock <= 5
                          ? `${totalStock} left`
                          : `${totalStock} units`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-[9px] text-zinc-400">
              Live customer preview simulator
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
