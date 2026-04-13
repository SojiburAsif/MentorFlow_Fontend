/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllCategories } from "@/services/category.service";
import { Layers, Hash } from "lucide-react";

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
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Layers size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-5 hover:border-blue-500/25 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/15 rounded-lg group-hover:bg-blue-500/25 transition-colors">
                    <Hash size={14} className="text-blue-400" />
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{cat.name}</p>
                </div>
                {cat.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
