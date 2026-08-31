"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Globe,
  Sparkles,
  Loader2,
  UploadCloud,
  ImageIcon,
  X,
} from "lucide-react";
import type {
  CategoryItem,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/app/services/admin/categories";
import { uploadProductImage } from "@/app/services/admin/products";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/toast";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryItem | null;
  onSubmit: (input: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  isLoading?: boolean;
}

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

function CategoryFormInner({
  category,
  onSubmit,
  isLoading,
  onClose,
}: {
  category?: CategoryItem | null;
  onSubmit: (input: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}) {
  const isEdit = Boolean(category);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(category?.slug),
  );
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [isActive, setIsActive] = useState(category?.is_active ?? true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(slugify(val));
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File Too Large", "Cover image must be under 2 MB.");
      return;
    }

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await uploadProductImage(formData);
      setImage(url);
      toast.success(
        "Image Uploaded",
        "Category cover image updated successfully.",
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload image.";
      toast.error("Upload Error", msg);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || slugify(name.trim());

    await onSubmit({
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      image: image.trim() || null,
      is_active: isActive,
      parent_id: null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between font-sans"
    >
      {/* 1. Sheet Top Header (Matching ProductDetailsSheet) */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 p-4 pr-12">
        <div>
          <SheetTitle className="text-base font-semibold text-zinc-900 font-sans">
            {isEdit ? "Edit Category" : "Add Category"}
          </SheetTitle>
          <p className="mt-0.5 text-xs text-zinc-400 font-mono">
            {slug ? `/${slug}` : "/category-slug"}
          </p>
        </div>

        <Badge variant={isActive ? "active" : "inactive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* 2. Sheet Scrollable Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-5 space-y-6">
          {/* Overview Summary Card */}
          <div className="flex gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100">
              {image ? (
                <Image
                  src={image}
                  alt={name || "Preview"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-300">
                  <ImageIcon className="size-6" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-xs text-zinc-500 font-medium">Main Department</p>
              <h2 className="text-sm font-semibold leading-tight text-zinc-900 truncate">
                {name || "Untitled Category"}
              </h2>
              <p className="text-xs text-zinc-400 font-mono truncate">
                {slug ? `/${slug}` : "/category-slug"}
              </p>
              {description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-3.5">
            <p className="text-xs sm:text-sm font-semibold text-zinc-900">
              Category Details
            </p>

            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Category Name *
              </Label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Men, Women, Kids, Accessories"
                required
                className="h-10 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs font-medium focus-visible:bg-white shadow-2xs"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                  <Globe className="size-3 text-zinc-400" />
                  <span>URL Slug</span>
                </Label>
                {isSlugManuallyEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugManuallyEdited(false);
                      setSlug(slugify(name));
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    <span>Auto sync</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 select-none">
                  /
                </span>
                <Input
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="category-slug"
                  className="h-10 pl-7 rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs font-mono text-zinc-800 focus-visible:bg-white shadow-2xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700">
                Description <span className="text-zinc-400 font-normal">(Optional)</span>
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide an overview for marketing & department landing page..."
                className="rounded-xl bg-[#fbfbfb] border-zinc-200 text-xs min-h-20 focus-visible:bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Cover Image Section */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-zinc-900">
              Department Cover Banner
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            {image ? (
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 group">
                <Image
                  src={image}
                  alt="Category Cover"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="h-8 rounded-lg bg-white/90 text-xs font-semibold text-zinc-900 hover:bg-white"
                  >
                    Change Image
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setImage("")}
                    className="size-8 rounded-lg"
                    title="Remove Image"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-[#fbfbfb] p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <span className="text-xs font-semibold text-zinc-600">
                      Uploading banner asset...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white border border-zinc-200 shadow-2xs mb-2">
                      <UploadCloud className="size-5 text-zinc-500" />
                    </div>
                    <p className="text-xs font-bold text-zinc-800">
                      Click to upload category cover photo
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      PNG, JPG, WebP up to 2 MB
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Visibility Toggle Card */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-zinc-900">
              Publishing Settings
            </p>

            <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-zinc-800 cursor-pointer">
                  Storefront Visibility
                </Label>
                <p className="text-[11px] text-zinc-400">
                  {isActive ? "Active and visible to customers" : "Hidden draft"}
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sheet Footer Action Controls (Matching ProductDetailsSheet) */}
      <div className="shrink-0 space-y-2 border-t border-zinc-100 bg-white p-4">
        <Button
          type="submit"
          disabled={isLoading || isUploadingImage || !name.trim()}
          className="h-10 w-full rounded-xl bg-primary text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 size-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Category"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
          className="h-9 w-full rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

/**
 * Slide-out drawer to Create or Edit a Parent Category matching ProductDetailsSheet design.
 */
export function CategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading = false,
}: CategoryModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-none flex-col gap-0 overflow-hidden bg-white p-0 sm:max-w-md"
      >
        {open && (
          <CategoryFormInner
            key={category?.id ?? "new"}
            category={category}
            onSubmit={onSubmit}
            isLoading={isLoading}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CategoryModal;
