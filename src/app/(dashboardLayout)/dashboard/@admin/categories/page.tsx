/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllCategories } from "@/services/category.service";
import { Layers } from "lucide-react";
import AdminCategoriesClient from "@/components/module/categories/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const result = await getAllCategories();
  const categories: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Layers size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Categories</h1>
            <p className="text-xs text-slate-500">{categories.length} subject categories</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <AdminCategoriesClient initial={categories} />
      </div>
    </div>
  );
}
