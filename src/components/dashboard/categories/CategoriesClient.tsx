"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Tags, X } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  createCategory,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
  type CategoryHierarchy,
  type CategoryItem,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/app/services/admin/categories";
import { TopHeader } from "@/components/dashboard/categories/shared/TopHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryHierarchyCard } from "@/components/dashboard/categories/CategoryHierarchyCard";
import { CategoryModal } from "@/components/dashboard/categories/CategoryModal";
import { CollectionModal } from "@/components/dashboard/categories/CollectionModal";
import { DeleteCategoryDialog } from "@/components/dashboard/categories/DeleteCategoryDialog";

interface CategoriesClientProps {
  initialCategories: CategoryHierarchy[];
}

/**
 * Client coordinator for Categories & Nested Collections dashboard.
 */
export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryHierarchy[]>(initialCategories);
  const [prevInitial, setPrevInitial] = useState(initialCategories);

  if (initialCategories !== prevInitial) {
    setPrevInitial(initialCategories);
    setCategories(initialCategories);
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CategoryItem | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CategoryItem | null>(null);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((parent) => {
        const matchedCollections = (parent.collections || []).filter((col) => {
          return (
            col.name.toLowerCase().includes(query) ||
            col.slug.toLowerCase().includes(query)
          );
        });

        const parentMatches =
          parent.name.toLowerCase().includes(query) ||
          parent.slug.toLowerCase().includes(query);

        if (parentMatches || matchedCollections.length > 0) {
          return {
            ...parent,
            collections: query ? matchedCollections : parent.collections,
          };
        }

        return null;
      })
      .filter(Boolean) as CategoryHierarchy[];
  }, [categories, searchQuery]);

  // Handler: Toggle Active status for Category or Collection
  const handleToggleActive = async (id: string, newActive: boolean) => {
    // Optimistic UI Update
    setCategories((prev) =>
      prev.map((parent) => {
        if (parent.id === id) {
          return { ...parent, is_active: newActive };
        }
        return {
          ...parent,
          collections: (parent.collections || []).map((col) =>
            col.id === id ? { ...col, is_active: newActive } : col,
          ),
        };
      }),
    );

    try {
      await toggleCategoryActive(id, newActive);
      toast.success(
        newActive ? "Status: Active" : "Status: Hidden",
        newActive
          ? "Item is now active and visible in the storefront."
          : "Item is hidden from the storefront.",
      );
    } catch (err) {
      console.error("Toggle active error:", err);
      toast.error("Status Update Failed", "Could not change status.");
      // Rollback
      setCategories(initialCategories);
    }
  };

  // Handler: Save Category (Create or Edit)
  const handleSaveCategory = async (input: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      setIsLoading(true);
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, input);
        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingCategory.id
              ? { ...item, ...updated }
              : item,
          ),
        );
        toast.success("Category Updated", `"${input.name}" has been updated.`);
      } else {
        const created = await createCategory(input as CreateCategoryInput);
        setCategories((prev) => [
          { ...created, product_count: 0, total_stock: 0, collections: [] },
          ...prev,
        ]);
        toast.success("Category Created", `"${input.name}" has been added.`);
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save category.";
      toast.error("Saving Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Save Collection (Create or Edit)
  const handleSaveCollection = async (input: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      setIsLoading(true);
      if (editingCollection) {
        const updated = await updateCategory(editingCollection.id, input);
        setCategories((prev) =>
          prev.map((parent) => ({
            ...parent,
            collections: (parent.collections || []).map((col) =>
              col.id === editingCollection.id ? { ...col, ...updated } : col,
            ),
          })),
        );
        toast.success("Collection Updated", `"${input.name}" has been updated.`);
      } else {
        const created = await createCategory(input as CreateCategoryInput);
        setCategories((prev) =>
          prev.map((parent) =>
            parent.id === created.parent_id
              ? {
                  ...parent,
                  collections: [
                    ...(parent.collections || []),
                    { ...created, product_count: 0, total_stock: 0 },
                  ],
                }
              : parent,
          ),
        );
        toast.success("Collection Created", `"${input.name}" collection has been published.`);
      }
      setCollectionModalOpen(false);
      setEditingCollection(null);
      setDefaultParentId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save collection.";
      toast.error("Saving Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Delete Item
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setIsLoading(true);
      await deleteCategory(deletingItem.id);

      setCategories((prev) => {
        if (!deletingItem.parent_id) {
          // Deleted parent category
          return prev.filter((p) => p.id !== deletingItem.id);
        } else {
          // Deleted child collection
          return prev.map((p) => ({
            ...p,
            collections: (p.collections || []).filter((c) => c.id !== deletingItem.id),
          }));
        }
      });

      toast.success(
        "Deleted Successfully",
        `"${deletingItem.name}" was removed from the catalog.`,
      );
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete.";
      toast.error("Delete Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 font-sans">
      {/* 1. Page Header */}
      <TopHeader
        title="Categories & Collections"
        description="Organize luxury fashion lines, seasonal collections, and storefront hierarchies."
        buttonName="Add Main Category"
        onButtonClick={() => {
          setEditingCategory(null);
          setCategoryModalOpen(true);
        }}
      />

      {/* 2. Search & Quick Actions Bar */}
      <section className="rounded-2xl border border-black/10 bg-white p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories or collections by name or slug..."
              className="h-10 rounded-xl border-zinc-200/90 bg-white pl-10 pr-10 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setEditingCollection(null);
              setDefaultParentId(categories[0]?.id || null);
              setCollectionModalOpen(true);
            }}
            className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shrink-0 shadow-xs"
          >
            <Plus className="size-3.5 mr-1.5" />
            <span className="hidden sm:inline">Add New Collection</span>
            <span className="sm:hidden">Collection</span>
          </Button>
        </div>
      </section>

      {/* 3. Hierarchy Category Cards List */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <CategoryHierarchyCard
              key={category.id}
              category={category}
              onToggleActive={handleToggleActive}
              onAddCollection={(parent) => {
                setEditingCollection(null);
                setDefaultParentId(parent.id);
                setCollectionModalOpen(true);
              }}
              onEditCategory={(cat) => {
                setEditingCategory(cat);
                setCategoryModalOpen(true);
              }}
              onDeleteCategory={(cat) => {
                setDeletingItem(cat);
                setDeleteDialogOpen(true);
              }}
              onEditCollection={(col) => {
                setEditingCollection(col);
                setDefaultParentId(col.parent_id);
                setCollectionModalOpen(true);
              }}
              onDeleteCollection={(col) => {
                setDeletingItem(col);
                setDeleteDialogOpen(true);
              }}
              disabled={isLoading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-black/10 bg-white p-6">
          <Tags className="size-8 text-zinc-300 mb-2" />
          <h3 className="text-sm font-bold text-zinc-800">No categories found</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            {searchQuery
              ? `No categories or collections matching "${searchQuery}".`
              : "Create your first main category to start organizing fashion lines."}
          </p>
          <Button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setCategoryModalOpen(true);
            }}
            className="mt-4 rounded-xl bg-primary text-xs font-semibold text-white"
          >
            <Plus className="size-3.5 mr-1.5" />
            Add Main Category
          </Button>
        </div>
      )}

      {/* 4. Modals */}
      <CategoryModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={editingCategory}
        onSubmit={handleSaveCategory}
        isLoading={isLoading}
      />

      <CollectionModal
        open={collectionModalOpen}
        onOpenChange={setCollectionModalOpen}
        collection={editingCollection}
        parentCategories={categories}
        defaultParentId={defaultParentId}
        onSubmit={handleSaveCollection}
        isLoading={isLoading}
      />

      <DeleteCategoryDialog
        item={deletingItem}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
