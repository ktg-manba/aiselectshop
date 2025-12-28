"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    slug: "",
    name_en: "",
    name_zh: "",
    description_en: "",
    description_zh: "",
    icon: "",
    order_index: 0,
  });
  const [subtagForm, setSubtagForm] = useState({
    category_id: "",
    name_en: "",
    name_zh: "",
    order_index: 0,
  });

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  async function loadCategories() {
    const res = await fetch("/api/admin/categories");
    if (!res.ok) return;
    const payload = await res.json();
    setCategories(payload.data || []);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryForm),
    });
    const payload = await res.json();
    if (!res.ok) {
      setMessage(payload.error || "Failed to create category");
      return;
    }
    setCategoryForm({
      slug: "",
      name_en: "",
      name_zh: "",
      description_en: "",
      description_zh: "",
      icon: "",
      order_index: 0,
    });
    loadCategories();
  }

  async function handleCreateSubtag(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subtagForm.category_id) {
      setMessage("Category id is required for subtag");
      return;
    }
    setMessage(null);
    const res = await fetch(`/api/admin/categories/${subtagForm.category_id}/subtags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subtagForm),
    });
    const payload = await res.json();
    if (!res.ok) {
      setMessage(payload.error || "Failed to create subtag");
      return;
    }
    setSubtagForm({
      category_id: "",
      name_en: "",
      name_zh: "",
      order_index: 0,
    });
    loadCategories();
  }

  async function handleDeleteCategory(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  async function handleDeleteSubtag(id: string) {
    await fetch(`/api/admin/subtags/${id}`, { method: "DELETE" });
    loadCategories();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="font-display text-2xl font-bold">Categories</div>
              <div className="text-sm text-gray-500">Manage categories & subtags.</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="border border-gray-200 rounded-full px-4 py-2 text-sm">
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="border border-gray-200 rounded-full px-4 py-2 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {message && <div className="text-xs text-red-500 mb-3">{message}</div>}

          <form className="grid gap-3 md:grid-cols-2 mb-6" onSubmit={handleCreateCategory}>
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Slug (ai-coding)"
              value={categoryForm.slug}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Name EN"
              value={categoryForm.name_en}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, name_en: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Name ZH"
              value={categoryForm.name_zh}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, name_zh: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Icon"
              value={categoryForm.icon}
              onChange={(event) =>
                setCategoryForm((prev) => ({ ...prev, icon: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Order Index"
              value={categoryForm.order_index}
              onChange={(event) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  order_index: Number(event.target.value || 0),
                }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
              placeholder="Description EN"
              value={categoryForm.description_en}
              onChange={(event) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description_en: event.target.value,
                }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
              placeholder="Description ZH"
              value={categoryForm.description_zh}
              onChange={(event) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description_zh: event.target.value,
                }))
              }
            />
            <button className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm md:col-span-2">
              Create Category
            </button>
          </form>

          <form className="grid gap-3 md:grid-cols-2 mb-6" onSubmit={handleCreateSubtag}>
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Category ID (uuid)"
              value={subtagForm.category_id}
              onChange={(event) =>
                setSubtagForm((prev) => ({ ...prev, category_id: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Subtag EN"
              value={subtagForm.name_en}
              onChange={(event) =>
                setSubtagForm((prev) => ({ ...prev, name_en: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Subtag ZH"
              value={subtagForm.name_zh}
              onChange={(event) =>
                setSubtagForm((prev) => ({ ...prev, name_zh: event.target.value }))
              }
            />
            <input
              className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Order Index"
              value={subtagForm.order_index}
              onChange={(event) =>
                setSubtagForm((prev) => ({
                  ...prev,
                  order_index: Number(event.target.value || 0),
                }))
              }
            />
            <button className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm md:col-span-2">
              Create Subtag
            </button>
          </form>

          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">{category.name_en}</div>
                    <div className="text-xs text-gray-500">{category.slug}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="rounded-full px-2 py-1 border border-gray-200 text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </div>
                {Array.isArray(category.subTags) && category.subTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {category.subTags.map((tag: any) => (
                      <button
                        key={tag.id}
                        onClick={() => handleDeleteSubtag(tag.id)}
                        className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                      >
                        {tag.name_en || tag.name?.en || "tag"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
