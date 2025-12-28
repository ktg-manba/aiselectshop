"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ToolRow = {
  id: string;
  name_en: string;
  name_zh: string;
  description_en: string | null;
  description_zh: string | null;
  detailed_intro_en: string | null;
  detailed_intro_zh: string | null;
  official_url: string | null;
  category_id: string | null;
  pricing_type: string | null;
  tags_en: string[];
  tags_zh: string[];
  subtags_en: string[];
  subtags_zh: string[];
  is_featured: boolean;
  view_count: number;
};

type CaseRow = {
  id: string;
  title_en: string;
  title_zh: string;
  description_en: string | null;
  description_zh: string | null;
  detailed_content_en: string | null;
  detailed_content_zh: string | null;
  thumbnail_url: string | null;
  case_type_en: string | null;
  case_type_zh: string | null;
  tags_en: string[];
  tags_zh: string[];
  subtags_en: string[];
  subtags_zh: string[];
  tools_en: string[];
  tools_zh: string[];
  results_speed: string | null;
  results_cost: string | null;
  results_match: string | null;
  is_featured: boolean;
  view_count: number;
};

type CategoryRow = {
  id: string;
  slug?: string | null;
  name_en: string;
  name_zh: string;
  description_en?: string | null;
  description_zh?: string | null;
  icon?: string | null;
  order_index?: number | null;
  subTags?: Array<{
    id: string;
    name_en: string;
    name_zh: string;
    order_index?: number | null;
  }>;
};

const emptyToolForm = {
  name_en: "",
  name_zh: "",
  description_en: "",
  description_zh: "",
  detailed_intro_en: "",
  detailed_intro_zh: "",
  official_url: "",
  category_id: "",
  pricing_type: "",
  tags_en: "",
  tags_zh: "",
  subtags_en: "",
  subtags_zh: "",
  is_featured: false,
  view_count: 0,
};

const emptyCaseForm = {
  title_en: "",
  title_zh: "",
  description_en: "",
  description_zh: "",
  detailed_content_en: "",
  detailed_content_zh: "",
  thumbnail_url: "",
  case_type_en: "",
  case_type_zh: "",
  tags_en: "",
  tags_zh: "",
  subtags_en: "",
  subtags_zh: "",
  tools_en: "",
  tools_zh: "",
  is_featured: false,
  view_count: 0,
};

function joinList(list?: string[]) {
  if (!list || list.length === 0) return "";
  return list.join(" | ");
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    slug: "",
    name_en: "",
    name_zh: "",
    description_en: "",
    description_zh: "",
    icon: "",
    order_index: 0,
  });
  const [subtagForm, setSubtagForm] = useState({
    id: "",
    category_id: "",
    name_en: "",
    name_zh: "",
    order_index: 0,
  });
  const [categoryMode, setCategoryMode] = useState<"create" | "edit">("create");
  const [subtagMode, setSubtagMode] = useState<"create" | "edit">("create");
  const [activeGroup, setActiveGroup] = useState<"tools" | "cases" | "categories" | null>(
    null
  );
  const [activeModule, setActiveModule] = useState<
    | "tool-create"
    | "tool-manage"
    | "tool-edit"
    | "case-create"
    | "case-manage"
    | "case-edit"
    | "category-create"
    | "category-manage"
    | null
  >(null);
  const [toolForm, setToolForm] = useState({ ...emptyToolForm });
  const [caseForm, setCaseForm] = useState({ ...emptyCaseForm });
  const [editingTool, setEditingTool] = useState<ToolRow | null>(null);
  const [editingCase, setEditingCase] = useState<CaseRow | null>(null);
  const [toolFilter, setToolFilter] = useState<string>("all");
  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [message, setMessage] = useState<string | null>(null);

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

  async function loadTools() {
    const res = await fetch("/api/admin/tools");
    if (!res.ok) return;
    const payload = await res.json();
    setTools(payload.data || []);
  }

  async function loadCases() {
    const res = await fetch("/api/admin/cases");
    if (!res.ok) return;
    const payload = await res.json();
    setCases(payload.data || []);
  }

  useEffect(() => {
    loadTools();
    loadCases();
  }, []);

  const filteredTools = useMemo(() => {
    if (toolFilter === "all") return tools;
    return tools.filter((tool) => tool.category_id === toolFilter);
  }, [toolFilter, tools]);

  const filteredCases = useMemo(() => {
    if (caseFilter === "all") return cases;
    return cases.filter((item) => {
      const types = (item.case_type_en || "")
        .split("|")
        .map((entry) => entry.trim())
        .filter(Boolean);
      return types.includes(caseFilter);
    });
  }, [caseFilter, cases]);

  const selectedCategorySubtags = useMemo(() => {
    const category = categories.find((item) => item.id === toolForm.category_id);
    return category?.subTags || [];
  }, [categories, toolForm.category_id]);

  function setToolCategory(categoryId: string) {
    setToolForm((prev) => ({
      ...prev,
      category_id: categoryId,
      subtags_en: "",
      subtags_zh: "",
    }));
  }

  const selectedSubtagNames = useMemo(() => {
    const source = toolForm.subtags_en || toolForm.subtags_zh || "";
    if (!source) return [];
    const raw = source
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    if (toolForm.subtags_en) return raw;
    const enMap = new Map(
      selectedCategorySubtags.map((item) => [item.name_zh, item.name_en])
    );
    return raw.map((item) => enMap.get(item) || item);
  }, [toolForm.subtags_en, toolForm.subtags_zh, selectedCategorySubtags]);

  function toggleToolSubtag(subtag: { name_en: string; name_zh: string }) {
    const enMap = new Map(selectedCategorySubtags.map((item) => [item.name_zh, item.name_en]));
    const zhMap = new Map(selectedCategorySubtags.map((item) => [item.name_en, item.name_zh]));
    const rawSubtags = (toolForm.subtags_en || toolForm.subtags_zh || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const currentEn =
      toolForm.subtags_en && toolForm.subtags_en.trim().length > 0
        ? rawSubtags
        : rawSubtags.map((item) => enMap.get(item) || item);
    const next = new Set(currentEn);
    if (next.has(subtag.name_en)) {
      next.delete(subtag.name_en);
    } else {
      next.add(subtag.name_en);
    }
    const nextEn = Array.from(next);
    const nextZh = nextEn.map((item) => zhMap.get(item) || item);
    setToolForm((prev) => ({
      ...prev,
      subtags_en: nextEn.join("|"),
      subtags_zh: nextZh.join("|"),
    }));
  }

  const selectedCaseCategoryIds = useMemo(() => {
    const raw =
      (caseForm.case_type_en || caseForm.case_type_zh || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean) || [];
    const ids = raw
      .map((name) => {
        return (
          categories.find((category) => category.name_en === name)?.id ||
          categories.find((category) => category.name_zh === name)?.id ||
          ""
        );
      })
      .filter(Boolean);
    return Array.from(new Set(ids));
  }, [categories, caseForm.case_type_en, caseForm.case_type_zh]);

  const selectedCaseCategoryIdSet = useMemo(() => {
    return new Set(selectedCaseCategoryIds);
  }, [selectedCaseCategoryIds]);

  const caseTypeValues = useMemo(() => {
    const source = caseForm.case_type_en || caseForm.case_type_zh || "";
    if (!source) return [];
    return source
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [caseForm.case_type_en, caseForm.case_type_zh]);

  const unmatchedCaseTypes = useMemo(() => {
    if (caseTypeValues.length === 0) return [];
    return caseTypeValues.filter((value) => {
      return !categories.some(
        (category) =>
          category.name_en === value ||
          category.name_zh === value ||
          category.slug === value
      );
    });
  }, [caseTypeValues, categories]);

  const selectedCaseSubtags = useMemo(() => {
    const allSubtags = categories
      .filter((category) => selectedCaseCategoryIdSet.has(category.id))
      .flatMap((category) => category.subTags || []);
    const seen = new Set<string>();
    return allSubtags.filter((item) => {
      if (seen.has(item.name_en)) return false;
      seen.add(item.name_en);
      return true;
    });
  }, [categories, selectedCaseCategoryIdSet]);

  const selectedCaseSubtagNames = useMemo(() => {
    const source = caseForm.subtags_en || caseForm.subtags_zh || "";
    if (!source) return [];
    const raw = source
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    if (caseForm.subtags_en) return raw;
    const enMap = new Map(
      selectedCaseSubtags.map((item) => [item.name_zh, item.name_en])
    );
    return raw.map((item) => enMap.get(item) || item);
  }, [caseForm.subtags_en, caseForm.subtags_zh, selectedCaseSubtags]);

  const unmatchedCaseSubtags = useMemo(() => {
    if (selectedCaseSubtagNames.length === 0) return [];
    const available = new Set(selectedCaseSubtags.map((item) => item.name_en));
    return selectedCaseSubtagNames.filter((name) => !available.has(name));
  }, [selectedCaseSubtagNames, selectedCaseSubtags]);

  const selectedCaseToolNames = useMemo(() => {
    const source = caseForm.tools_en || caseForm.tools_zh || "";
    if (!source) return [];
    const raw = source
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    if (caseForm.tools_en) return raw;
    const enMap = new Map(tools.map((item) => [item.name_zh, item.name_en]));
    return raw.map((item) => enMap.get(item) || item);
  }, [caseForm.tools_en, caseForm.tools_zh, tools]);

  function toggleCaseCategory(category: CategoryRow) {
    const nextIds = new Set(selectedCaseCategoryIds);
    if (nextIds.has(category.id)) {
      nextIds.delete(category.id);
    } else {
      nextIds.add(category.id);
    }
    const selectedCategories = categories.filter((item) => nextIds.has(item.id));
    const nextCaseTypeEn = selectedCategories.map((item) => item.name_en).join("|");
    const nextCaseTypeZh = selectedCategories.map((item) => item.name_zh).join("|");
    const availableSubtags = selectedCategories.flatMap((item) => item.subTags || []);
    const enMap = new Map(availableSubtags.map((item) => [item.name_zh, item.name_en]));
    const zhMap = new Map(availableSubtags.map((item) => [item.name_en, item.name_zh]));
    const rawSubtags = (caseForm.subtags_en || caseForm.subtags_zh || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const currentEn =
      caseForm.subtags_en && caseForm.subtags_en.trim().length > 0
        ? rawSubtags
        : rawSubtags.map((item) => enMap.get(item) || item);
    const filteredEn = currentEn.filter((item) => zhMap.has(item));
    const filteredZh = filteredEn.map((item) => zhMap.get(item) || item);
    setCaseForm((prev) => ({
      ...prev,
      case_type_en: nextCaseTypeEn,
      case_type_zh: nextCaseTypeZh,
      subtags_en: filteredEn.join("|"),
      subtags_zh: filteredZh.join("|"),
    }));
  }

  function toggleCaseSubtag(subtag: { name_en: string; name_zh: string }) {
    const enMap = new Map(selectedCaseSubtags.map((item) => [item.name_zh, item.name_en]));
    const zhMap = new Map(selectedCaseSubtags.map((item) => [item.name_en, item.name_zh]));
    const rawSubtags = (caseForm.subtags_en || caseForm.subtags_zh || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const currentEn =
      caseForm.subtags_en && caseForm.subtags_en.trim().length > 0
        ? rawSubtags
        : rawSubtags.map((item) => enMap.get(item) || item);
    const next = new Set(currentEn);
    if (next.has(subtag.name_en)) {
      next.delete(subtag.name_en);
    } else {
      next.add(subtag.name_en);
    }
    const nextEn = Array.from(next);
    const nextZh = nextEn.map((item) => zhMap.get(item) || item);
    setCaseForm((prev) => ({
      ...prev,
      subtags_en: nextEn.join("|"),
      subtags_zh: nextZh.join("|"),
    }));
  }

  function toggleCaseTool(tool: ToolRow) {
    const enMap = new Map(tools.map((item) => [item.name_zh, item.name_en]));
    const zhMap = new Map(tools.map((item) => [item.name_en, item.name_zh]));
    const rawTools = (caseForm.tools_en || caseForm.tools_zh || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);
    const currentEn =
      caseForm.tools_en && caseForm.tools_en.trim().length > 0
        ? rawTools
        : rawTools.map((item) => enMap.get(item) || item);
    const next = new Set(currentEn);
    if (next.has(tool.name_en)) {
      next.delete(tool.name_en);
    } else {
      next.add(tool.name_en);
    }
    const nextEn = Array.from(next);
    const nextZh = nextEn.map((item) => zhMap.get(item) || item);
    setCaseForm((prev) => ({
      ...prev,
      tools_en: nextEn.join("|"),
      tools_zh: nextZh.join("|"),
    }));
  }

  const caseTypes = useMemo(() => {
    const values = cases
      .flatMap((item) =>
        (item.case_type_en || "")
          .split("|")
          .map((entry) => entry.trim())
          .filter(Boolean)
      )
      .filter(Boolean);
    return Array.from(new Set(values));
  }, [cases]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  }

  async function handleToolCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolForm),
    });
    const payload = await res.json();
    if (!res.ok) {
      setMessage(payload.error || "Failed to create tool.");
      return;
    }
    setToolForm({ ...emptyToolForm });
    await loadTools();
    setActiveModule(null);
  }

  async function handleToolUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTool) return;
    setMessage(null);
    const res = await fetch(`/api/admin/tools/${editingTool.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolForm),
    });
    const payload = await res.json();
    if (!res.ok) {
      setMessage(payload.error || "Failed to update tool.");
      return;
    }
    setEditingTool(null);
    setActiveModule(null);
    await loadTools();
  }

  async function handleToolDelete(tool: ToolRow) {
    if (!window.confirm(`Delete ${tool.name_en}?`)) return;
    await fetch(`/api/admin/tools/${tool.id}`, { method: "DELETE" });
    await loadTools();
  }

  async function handleCaseCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caseForm),
    });
    const payload = await res.json();
    if (!res.ok) {
      setMessage(payload.error || "Failed to create case.");
      return;
    }
    setCaseForm({ ...emptyCaseForm });
    await loadCases();
    setActiveModule(null);
  }

  async function handleCaseUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCase) return;
    setMessage(null);
    const res = await fetch(`/api/admin/cases/${editingCase.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caseForm),
    });
    const payload = await res.json();
    if (!res.ok) {
      setMessage(payload.error || "Failed to update case.");
      return;
    }
    setEditingCase(null);
    setActiveModule(null);
    await loadCases();
  }

  async function handleCaseDelete(item: CaseRow) {
    if (!window.confirm(`Delete ${item.title_en}?`)) return;
    await fetch(`/api/admin/cases/${item.id}`, { method: "DELETE" });
    await loadCases();
  }

  function resetCategoryForm() {
    setCategoryForm({
      id: "",
      slug: "",
      name_en: "",
      name_zh: "",
      description_en: "",
      description_zh: "",
      icon: "",
      order_index: 0,
    });
    setCategoryMode("create");
  }

  function resetSubtagForm() {
    setSubtagForm({
      id: "",
      category_id: "",
      name_en: "",
      name_zh: "",
      order_index: 0,
    });
    setSubtagMode("create");
  }

  async function handleCategorySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!categoryForm.slug || !categoryForm.name_en || !categoryForm.name_zh) {
      setMessage("Category slug and names are required.");
      return;
    }
    const payload = {
      slug: categoryForm.slug,
      name_en: categoryForm.name_en,
      name_zh: categoryForm.name_zh,
      description_en: categoryForm.description_en,
      description_zh: categoryForm.description_zh,
      icon: categoryForm.icon,
      order_index: categoryForm.order_index,
    };
    const res =
      categoryMode === "edit" && categoryForm.id
        ? await fetch(`/api/admin/categories/${categoryForm.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    const response = await res.json();
    if (!res.ok) {
      setMessage(response.error || "Failed to save category.");
      return;
    }
    resetCategoryForm();
    await loadCategories();
  }

  async function handleCategoryDelete(item: CategoryRow) {
    if (!window.confirm(`Delete ${item.name_en}?`)) return;
    const res = await fetch(`/api/admin/categories/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      await loadCategories();
    }
  }

  function openCategoryEdit(item: CategoryRow) {
    setActiveModule("category-manage");
    setCategoryForm({
      id: item.id,
      slug: item.slug || "",
      name_en: item.name_en || "",
      name_zh: item.name_zh || "",
      description_en: item.description_en || "",
      description_zh: item.description_zh || "",
      icon: item.icon || "",
      order_index: item.order_index || 0,
    });
    setCategoryMode("edit");
  }

  async function handleSubtagSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!subtagForm.category_id || !subtagForm.name_en || !subtagForm.name_zh) {
      setMessage("Subtag category and names are required.");
      return;
    }
    const payload = {
      name_en: subtagForm.name_en,
      name_zh: subtagForm.name_zh,
      order_index: subtagForm.order_index,
    };
    const res =
      subtagMode === "edit" && subtagForm.id
        ? await fetch(`/api/admin/subtags/${subtagForm.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/categories/${subtagForm.category_id}/subtags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    const response = await res.json();
    if (!res.ok) {
      setMessage(response.error || "Failed to save subtag.");
      return;
    }
    resetSubtagForm();
    await loadCategories();
  }

  async function handleSubtagDelete(item: { id: string; name_en: string }) {
    if (!window.confirm(`Delete ${item.name_en}?`)) return;
    const res = await fetch(`/api/admin/subtags/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      await loadCategories();
    }
  }

  function openSubtagEdit(item: {
    id: string;
    name_en: string;
    name_zh: string;
    order_index?: number | null;
    category_id: string;
  }) {
    setActiveModule("category-manage");
    setSubtagForm({
      id: item.id,
      category_id: item.category_id,
      name_en: item.name_en,
      name_zh: item.name_zh,
      order_index: item.order_index || 0,
    });
    setSubtagMode("edit");
  }

  function openToolCreate() {
    setToolForm({ ...emptyToolForm });
    setEditingTool(null);
    setMessage(null);
    setActiveModule("tool-create");
  }

  function openToolEdit(tool: ToolRow) {
    setEditingTool(tool);
    setMessage(null);
    setToolForm({
      name_en: tool.name_en || "",
      name_zh: tool.name_zh || "",
      description_en: tool.description_en || "",
      description_zh: tool.description_zh || "",
      detailed_intro_en: tool.detailed_intro_en || "",
      detailed_intro_zh: tool.detailed_intro_zh || "",
      official_url: tool.official_url || "",
      category_id: tool.category_id || "",
      pricing_type: tool.pricing_type || "",
      tags_en: joinList(tool.tags_en),
      tags_zh: joinList(tool.tags_zh),
      subtags_en: joinList(tool.subtags_en),
      subtags_zh: joinList(tool.subtags_zh),
      is_featured: !!tool.is_featured,
      view_count: tool.view_count || 0,
    });
    setActiveModule("tool-edit");
  }

  function openCaseCreate() {
    setCaseForm({ ...emptyCaseForm });
    setEditingCase(null);
    setMessage(null);
    setActiveModule("case-create");
  }

  function openCaseEdit(item: CaseRow) {
    setEditingCase(item);
    setMessage(null);
    setCaseForm({
      title_en: item.title_en || "",
      title_zh: item.title_zh || "",
      description_en: item.description_en || "",
      description_zh: item.description_zh || "",
      detailed_content_en: item.detailed_content_en || "",
      detailed_content_zh: item.detailed_content_zh || "",
      thumbnail_url: item.thumbnail_url || "",
      case_type_en: item.case_type_en || "",
      case_type_zh: item.case_type_zh || "",
      tags_en: joinList(item.tags_en),
      tags_zh: joinList(item.tags_zh),
      subtags_en: joinList(item.subtags_en),
      subtags_zh: joinList(item.subtags_zh),
      tools_en: joinList(item.tools_en),
      tools_zh: joinList(item.tools_zh),
      is_featured: !!item.is_featured,
      view_count: item.view_count || 0,
    });
    setActiveModule("case-edit");
  }

  async function handleCaseUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "case");
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const payload = await res.json();
    if (res.ok) {
      setCaseForm((prev) => ({ ...prev, thumbnail_url: payload.url }));
    }
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="font-display text-2xl font-bold">Admin Console</div>
              <div className="text-sm text-gray-500">Curate tools and cases.</div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="admin-chip border border-gray-200 rounded-full px-4 py-2 text-sm"
              >
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="admin-chip border border-gray-200 rounded-full px-4 py-2 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {message && <div className="text-xs text-red-500 mb-3">{message}</div>}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveGroup("tools");
                setActiveModule(null);
              }}
              className={`admin-chip rounded-full px-5 py-2 text-sm ${
                activeGroup === "tools"
                  ? "bg-[#002FA7] text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => {
                setActiveGroup("cases");
                setActiveModule(null);
              }}
              className={`admin-chip rounded-full px-5 py-2 text-sm ${
                activeGroup === "cases"
                  ? "bg-[#002FA7] text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              Cases
            </button>
            <button
              onClick={() => {
                setActiveGroup("categories");
                setActiveModule(null);
              }}
              className={`admin-chip rounded-full px-5 py-2 text-sm ${
                activeGroup === "categories"
                  ? "bg-[#002FA7] text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              Categories
            </button>
          </div>

          {activeGroup && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeGroup === "tools" && (
                <>
                  <button
                    onClick={openToolCreate}
                    className="admin-chip rounded-full px-4 py-1.5 text-xs bg-white border border-gray-200"
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => {
                      setMessage(null);
                      setActiveModule("tool-manage");
                    }}
                    className="admin-chip rounded-full px-4 py-1.5 text-xs bg-white border border-gray-200"
                  >
                    Manage
                  </button>
                </>
              )}
              {activeGroup === "cases" && (
                <>
                  <button
                    onClick={openCaseCreate}
                    className="admin-chip rounded-full px-4 py-1.5 text-xs bg-white border border-gray-200"
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => {
                      setMessage(null);
                      setActiveModule("case-manage");
                    }}
                    className="admin-chip rounded-full px-4 py-1.5 text-xs bg-white border border-gray-200"
                  >
                    Manage
                  </button>
                </>
              )}
              {activeGroup === "categories" && (
                <>
                  <button
                    onClick={() => {
                      resetCategoryForm();
                      resetSubtagForm();
                      setMessage(null);
                      setActiveModule("category-create");
                    }}
                    className="admin-chip rounded-full px-4 py-1.5 text-xs bg-white border border-gray-200"
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => {
                      setMessage(null);
                      setActiveModule("category-manage");
                    }}
                    className="admin-chip rounded-full px-4 py-1.5 text-xs bg-white border border-gray-200"
                  >
                    Manage
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {activeModule && (
        <div className="max-w-5xl mx-auto">
          <div className="admin-panel mt-8 bg-white/90 rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)]">
          {message && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
              {message}
            </div>
          )}

          {(activeModule === "tool-create" || activeModule === "tool-edit") && (
            <form
              className="space-y-3"
              onSubmit={activeModule === "tool-edit" ? handleToolUpdate : handleToolCreate}
            >
              <div className="font-display text-xl font-bold">
                {activeModule === "tool-edit" ? "Edit Tool" : "Upload New Tool"}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  placeholder="Name (EN)"
                  value={toolForm.name_en}
                  onChange={(event) =>
                    setToolForm((prev) => ({ ...prev, name_en: event.target.value }))
                  }
                />
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  placeholder="名称 (ZH)"
                  value={toolForm.name_zh}
                  onChange={(event) =>
                    setToolForm((prev) => ({ ...prev, name_zh: event.target.value }))
                  }
                />
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs text-gray-500">Category</div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const isSelected = toolForm.category_id === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setToolCategory(category.id)}
                          className={`admin-chip rounded-full px-3 py-1 text-xs border ${
                            isSelected
                              ? "bg-[#002FA7] text-white border-[#002FA7]"
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                        >
                          {category.name_en} / {category.name_zh}
                        </button>
                      );
                    })}
                  </div>
                  {toolForm.category_id && (
                    <div className="text-[11px] text-gray-600">
                      Selected:{" "}
                      {categories
                        .filter((category) => category.id === toolForm.category_id)
                        .map((category) => `${category.name_en}/${category.name_zh}`)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <select
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  value={toolForm.pricing_type}
                  onChange={(event) =>
                    setToolForm((prev) => ({ ...prev, pricing_type: event.target.value }))
                  }
                >
                  <option value="">Pricing</option>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </select>
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  placeholder="Official URL"
                  value={toolForm.official_url}
                  onChange={(event) =>
                    setToolForm((prev) => ({ ...prev, official_url: event.target.value }))
                  }
                />
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  placeholder="Description EN"
                  value={toolForm.description_en}
                  onChange={(event) =>
                    setToolForm((prev) => ({ ...prev, description_en: event.target.value }))
                  }
                />
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  placeholder="Description ZH"
                  value={toolForm.description_zh}
                  onChange={(event) =>
                    setToolForm((prev) => ({ ...prev, description_zh: event.target.value }))
                  }
                />
                <textarea
                  className="rounded-2xl bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  rows={3}
                  placeholder="Detailed Intro EN"
                  value={toolForm.detailed_intro_en}
                  onChange={(event) =>
                    setToolForm((prev) => ({
                      ...prev,
                      detailed_intro_en: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="rounded-2xl bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  rows={3}
                  placeholder="Detailed Intro ZH"
                  value={toolForm.detailed_intro_zh}
                  onChange={(event) =>
                    setToolForm((prev) => ({
                      ...prev,
                      detailed_intro_zh: event.target.value,
                    }))
                  }
                />
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs text-gray-500">Subtags</div>
                  <div className="flex flex-wrap gap-2">
                    {!toolForm.category_id && (
                      <div className="text-[11px] text-gray-400">
                        Select a category first
                      </div>
                    )}
                    {selectedCategorySubtags.map((subtag) => {
                      const isSelected = selectedSubtagNames.includes(subtag.name_en);
                      return (
                        <button
                          key={subtag.id}
                          type="button"
                          onClick={() => toolForm.category_id && toggleToolSubtag(subtag)}
                          className={`admin-chip rounded-full px-3 py-1 text-xs border ${
                            isSelected
                              ? "bg-[#002FA7] text-white border-[#002FA7]"
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                          disabled={!toolForm.category_id}
                        >
                          {subtag.name_en} / {subtag.name_zh}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSubtagNames.length > 0 && (
                    <div className="text-[11px] text-gray-600">
                      Selected: {selectedSubtagNames.join(", ")}
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={toolForm.is_featured}
                    onChange={(event) =>
                      setToolForm((prev) => ({ ...prev, is_featured: event.target.checked }))
                    }
                  />
                  Featured on Home
                </label>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  className="admin-chip border border-gray-200 rounded-full px-4 py-2 text-sm"
                >
                  Close
                </button>
                <button className="admin-chip bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                  {activeModule === "tool-edit" ? "Save Changes" : "Create Tool"}
                </button>
              </div>
            </form>
          )}

          {activeModule === "tool-manage" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-display text-xl font-bold">Manage Tools</div>
                <select
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  value={toolFilter}
                  onChange={(event) => setToolFilter(event.target.value)}
                >
                  <option value="all">All types</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_en} / {category.name_zh}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="admin-card flex items-center justify-between gap-3 border border-gray-100 rounded-2xl p-3"
                  >
                    <div>
                      <div className="font-semibold text-sm">{tool.name_en}</div>
                      <div className="text-xs text-gray-500">{tool.name_zh}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => openToolEdit(tool)}
                        className="admin-chip rounded-full px-3 py-1 border border-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToolDelete(tool)}
                        className="admin-chip rounded-full px-3 py-1 border border-gray-200 text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeModule === "case-create" || activeModule === "case-edit") && (
            <form
              className="space-y-3"
              onSubmit={activeModule === "case-edit" ? handleCaseUpdate : handleCaseCreate}
            >
              <div className="font-display text-xl font-bold">
                {activeModule === "case-edit" ? "Edit Case" : "Upload New Case"}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  placeholder="Title (EN)"
                  value={caseForm.title_en}
                  onChange={(event) =>
                    setCaseForm((prev) => ({ ...prev, title_en: event.target.value }))
                  }
                />
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  placeholder="标题 (ZH)"
                  value={caseForm.title_zh}
                  onChange={(event) =>
                    setCaseForm((prev) => ({ ...prev, title_zh: event.target.value }))
                  }
                />
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs text-gray-500">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const isSelected = selectedCaseCategoryIds.includes(category.id);
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCaseCategory(category)}
                          className={`admin-chip rounded-full px-3 py-1 text-xs border ${
                            isSelected
                              ? "bg-[#002FA7] text-white border-[#002FA7]"
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                        >
                          {category.name_en} / {category.name_zh}
                        </button>
                      );
                    })}
                  </div>
                  {unmatchedCaseTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {unmatchedCaseTypes.map((value) => (
                        <span
                          key={value}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedCaseCategoryIds.length > 0 && (
                    <div className="text-[11px] text-gray-600">
                      Selected:{" "}
                      {categories
                        .filter((category) => selectedCaseCategoryIds.includes(category.id))
                        .map((category) => `${category.name_en}/${category.name_zh}`)
                        .join(", ")}
                    </div>
                  )}
                </div>
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  placeholder="Thumbnail URL"
                  value={caseForm.thumbnail_url}
                  onChange={(event) =>
                    setCaseForm((prev) => ({ ...prev, thumbnail_url: event.target.value }))
                  }
                />
                <label className="text-xs text-gray-500 md:col-span-2">
                  Upload Thumbnail
                  <input className="block mt-1 text-xs" type="file" onChange={handleCaseUpload} />
                </label>
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  placeholder="Description EN"
                  value={caseForm.description_en}
                  onChange={(event) =>
                    setCaseForm((prev) => ({ ...prev, description_en: event.target.value }))
                  }
                />
                <input
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  placeholder="Description ZH"
                  value={caseForm.description_zh}
                  onChange={(event) =>
                    setCaseForm((prev) => ({ ...prev, description_zh: event.target.value }))
                  }
                />
                <textarea
                  className="rounded-2xl bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  rows={3}
                  placeholder="Detailed Content EN"
                  value={caseForm.detailed_content_en}
                  onChange={(event) =>
                    setCaseForm((prev) => ({
                      ...prev,
                      detailed_content_en: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="rounded-2xl bg-gray-100 border-none px-4 py-2 text-sm md:col-span-2"
                  rows={3}
                  placeholder="Detailed Content ZH"
                  value={caseForm.detailed_content_zh}
                  onChange={(event) =>
                    setCaseForm((prev) => ({
                      ...prev,
                      detailed_content_zh: event.target.value,
                    }))
                  }
                />
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs text-gray-500">Subtags</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCaseSubtags.length === 0 && (
                      <div className="text-[11px] text-gray-400">
                        Select categories first
                      </div>
                    )}
                    {selectedCaseSubtags.map((subtag) => {
                      const isSelected = selectedCaseSubtagNames.includes(subtag.name_en);
                      return (
                        <button
                          key={subtag.id}
                          type="button"
                          onClick={() =>
                            selectedCaseCategoryIds.length > 0 && toggleCaseSubtag(subtag)
                          }
                          className={`admin-chip rounded-full px-3 py-1 text-xs border ${
                            isSelected
                              ? "bg-[#002FA7] text-white border-[#002FA7]"
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                          disabled={selectedCaseCategoryIds.length === 0}
                        >
                          {subtag.name_en} / {subtag.name_zh}
                        </button>
                      );
                    })}
                  </div>
                  {unmatchedCaseSubtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {unmatchedCaseSubtags.map((value) => (
                        <span
                          key={value}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedCaseSubtagNames.length > 0 && (
                    <div className="text-[11px] text-gray-600">
                      Selected: {selectedCaseSubtagNames.join(", ")}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="text-xs text-gray-500">Tools</div>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => {
                      const isSelected = selectedCaseToolNames.includes(tool.name_en);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => toggleCaseTool(tool)}
                          className={`admin-chip rounded-full px-3 py-1 text-xs border ${
                            isSelected
                              ? "bg-[#002FA7] text-white border-[#002FA7]"
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                        >
                          {tool.name_en} / {tool.name_zh}
                        </button>
                      );
                    })}
                  </div>
                  {selectedCaseToolNames.length > 0 && (
                    <div className="text-[11px] text-gray-600">
                      Selected: {selectedCaseToolNames.join(", ")}
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={caseForm.is_featured}
                    onChange={(event) =>
                      setCaseForm((prev) => ({ ...prev, is_featured: event.target.checked }))
                    }
                  />
                  Featured on Home
                </label>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  className="admin-chip border border-gray-200 rounded-full px-4 py-2 text-sm"
                >
                  Close
                </button>
                <button className="admin-chip bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                  {activeModule === "case-edit" ? "Save Changes" : "Create Case"}
                </button>
              </div>
            </form>
          )}

          {activeModule === "case-manage" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-display text-xl font-bold">Manage Cases</div>
                <select
                  className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                  value={caseFilter}
                  onChange={(event) => setCaseFilter(event.target.value)}
                >
                  <option value="all">All types</option>
                  {caseTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                {filteredCases.map((item) => (
                  <div
                    key={item.id}
                    className="admin-card flex items-center justify-between gap-3 border border-gray-100 rounded-2xl p-3"
                  >
                    <div>
                      <div className="font-semibold text-sm">{item.title_en}</div>
                      <div className="text-xs text-gray-500">{item.title_zh}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => openCaseEdit(item)}
                        className="admin-chip rounded-full px-3 py-1 border border-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCaseDelete(item)}
                        className="admin-chip rounded-full px-3 py-1 border border-gray-200 text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === "category-create" && (
            <div className="space-y-6">
              <div className="font-display text-xl font-bold">Upload Categories</div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-600">New Category</div>
                  <form className="space-y-3" onSubmit={handleCategorySubmit}>
                    <input
                      className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                      placeholder="Slug"
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
                      className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                      placeholder="Description ZH"
                      value={categoryForm.description_zh}
                      onChange={(event) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          description_zh: event.target.value,
                        }))
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
                      type="number"
                      placeholder="Order"
                      value={categoryForm.order_index}
                      onChange={(event) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          order_index: Number(event.target.value),
                        }))
                      }
                    />
                    <div className="flex items-center gap-2">
                      <button className="admin-chip bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                        Create Category
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-600">New Subtag</div>
                  <form className="space-y-3" onSubmit={handleSubtagSubmit}>
                    <select
                      className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                      value={subtagForm.category_id}
                      onChange={(event) =>
                        setSubtagForm((prev) => ({
                          ...prev,
                          category_id: event.target.value,
                        }))
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_en} / {category.name_zh}
                        </option>
                      ))}
                    </select>
                    <input
                      className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                      placeholder="Name EN"
                      value={subtagForm.name_en}
                      onChange={(event) =>
                        setSubtagForm((prev) => ({ ...prev, name_en: event.target.value }))
                      }
                    />
                    <input
                      className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                      placeholder="Name ZH"
                      value={subtagForm.name_zh}
                      onChange={(event) =>
                        setSubtagForm((prev) => ({ ...prev, name_zh: event.target.value }))
                      }
                    />
                    <input
                      className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                      type="number"
                      placeholder="Order"
                      value={subtagForm.order_index}
                      onChange={(event) =>
                        setSubtagForm((prev) => ({
                          ...prev,
                          order_index: Number(event.target.value),
                        }))
                      }
                    />
                    <div className="flex items-center gap-2">
                      <button className="admin-chip bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                        Create Subtag
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeModule === "category-manage" && (
            <div className="space-y-6">
              <div className="font-display text-xl font-bold">Manage Categories</div>
              {(categoryMode === "edit" || subtagMode === "edit") && (
                <div className="grid gap-6 md:grid-cols-2">
                  {categoryMode === "edit" && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-gray-600">Edit Category</div>
                      <form className="space-y-3" onSubmit={handleCategorySubmit}>
                        <input
                          className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                          placeholder="Slug"
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
                          className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                          placeholder="Description ZH"
                          value={categoryForm.description_zh}
                          onChange={(event) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              description_zh: event.target.value,
                            }))
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
                          type="number"
                          placeholder="Order"
                          value={categoryForm.order_index}
                          onChange={(event) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              order_index: Number(event.target.value),
                            }))
                          }
                        />
                        <div className="flex items-center gap-2">
                          <button className="admin-chip bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                            Save Category
                          </button>
                          <button
                            type="button"
                            onClick={resetCategoryForm}
                            className="admin-chip border border-gray-200 rounded-full px-4 py-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {subtagMode === "edit" && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-gray-600">Edit Subtag</div>
                      <form className="space-y-3" onSubmit={handleSubtagSubmit}>
                        <select
                          className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                          value={subtagForm.category_id}
                          onChange={(event) =>
                            setSubtagForm((prev) => ({
                              ...prev,
                              category_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name_en} / {category.name_zh}
                            </option>
                          ))}
                        </select>
                        <input
                          className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                          placeholder="Name EN"
                          value={subtagForm.name_en}
                          onChange={(event) =>
                            setSubtagForm((prev) => ({
                              ...prev,
                              name_en: event.target.value,
                            }))
                          }
                        />
                        <input
                          className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                          placeholder="Name ZH"
                          value={subtagForm.name_zh}
                          onChange={(event) =>
                            setSubtagForm((prev) => ({
                              ...prev,
                              name_zh: event.target.value,
                            }))
                          }
                        />
                        <input
                          className="rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
                          type="number"
                          placeholder="Order"
                          value={subtagForm.order_index}
                          onChange={(event) =>
                            setSubtagForm((prev) => ({
                              ...prev,
                              order_index: Number(event.target.value),
                            }))
                          }
                        />
                        <div className="flex items-center gap-2">
                          <button className="admin-chip bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                            Save Subtag
                          </button>
                          <button
                            type="button"
                            onClick={resetSubtagForm}
                            className="admin-chip border border-gray-200 rounded-full px-4 py-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="admin-card border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{category.name_en}</div>
                        <div className="text-xs text-gray-500">{category.name_zh}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => openCategoryEdit(category)}
                          className="admin-chip rounded-full px-3 py-1 border border-gray-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(category)}
                          className="admin-chip rounded-full px-3 py-1 border border-gray-200 text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {category.subTags && category.subTags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {category.subTags.map((subtag) => (
                          <div
                            key={subtag.id}
                            className="admin-card flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1"
                          >
                            <span>
                              {subtag.name_en} / {subtag.name_zh}
                            </span>
                            <button
                              onClick={() =>
                                openSubtagEdit({
                                  id: subtag.id,
                                  name_en: subtag.name_en,
                                  name_zh: subtag.name_zh,
                                  order_index: subtag.order_index,
                                  category_id: category.id,
                                })
                              }
                              className="admin-chip text-[#002FA7]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleSubtagDelete({
                                  id: subtag.id,
                                  name_en: subtag.name_en,
                                })
                              }
                              className="admin-chip text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes adminFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .admin-panel {
          animation: adminFadeUp 0.28s ease-out;
        }
        .admin-chip {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .admin-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 25px -20px rgba(0, 47, 167, 0.6);
        }
        .admin-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px -22px rgba(0, 47, 167, 0.5);
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-panel,
          .admin-chip,
          .admin-card {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
