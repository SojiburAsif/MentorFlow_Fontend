"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getMyWishlist } from "@/services/wishlist.service";
import {
  Heart,
  LayoutGrid,
  Table,
  Star,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import WishlistToggleInLink from "@/components/module/wishlist/WishlistToggleInLink";

export default function StudentWishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [view, setView] = useState<"card" | "table">("card");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getMyWishlist();
      const data = result.success
        ? Array.isArray(result.data)
          ? result.data
          : []
        : [];
      setItems(data);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070f] text-black dark:text-white transition-all">
      
      {/* HEADER */}
      <div className="border-b border-gray-200 dark:border-blue-900/20 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Heart size={18} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">My Wishlist</h1>
            <p className="text-xs text-gray-500">
              {items.length} saved tutors
            </p>
          </div>
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("card")}
            className={`p-2 rounded-lg ${
              view === "card"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-[#111] text-gray-500"
            }`}
          >
            <LayoutGrid size={16} />
          </button>

          <button
            onClick={() => setView("table")}
            className={`p-2 rounded-lg ${
              view === "table"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-[#111] text-gray-500"
            }`}
          >
            <Table size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-500">
            <Heart size={40} className="opacity-30 mb-3" />
            <p>No saved tutors</p>
          </div>
        ) : view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => {
              const tutor = item.tutorProfile ?? item.tutor ?? item;
              const id = item.tutorProfileId ?? tutor.id;

              return (
                <Link
                  key={id}
                  href={`/tutors/${id}`}
                  className="group rounded-2xl p-5 bg-white dark:bg-[#0d0d1a] border border-gray-200 dark:border-blue-900/20 hover:shadow-xl transition"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <img
                        src={tutor.user?.image}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <h2 className="font-bold">
                          {tutor.user?.name}
                        </h2>

                        <div className="flex gap-2 mt-1 flex-wrap text-xs">
                          {tutor.category?.name && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded flex items-center gap-1">
                              <BookOpen size={10} />
                              {tutor.category.name}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400" />
                            {tutor.rating || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <WishlistToggleInLink
                        tutorProfileId={String(id)}
                        initialActive={true}
                      />
                    </div>
                  </div>

                  {tutor.bio && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                      {tutor.bio}
                    </p>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <p className="font-bold text-blue-500">
                      ৳{tutor.price}
                    </p>

                    <span className="text-xs flex items-center gap-1 text-blue-500">
                      View <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900/20">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#0d0d1a] text-left">
                <tr>
                  <th className="p-3">Tutor</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.map((item: any) => {
                  const tutor = item.tutorProfile ?? item.tutor ?? item;
                  const id = item.tutorProfileId ?? tutor.id;

                  return (
                    <tr
                      key={id}
                      className="border-t border-gray-200 dark:border-blue-900/20 hover:bg-gray-50 dark:hover:bg-[#111]"
                    >
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={tutor.user?.image}
                          className="h-10 w-10 rounded-lg"
                        />
                        {tutor.user?.name}
                      </td>

                      <td>{tutor.category?.name}</td>

                      <td className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400" />
                        {tutor.rating || 0}
                      </td>

                      <td className="text-blue-500 font-semibold">
                        ৳{tutor.price}
                      </td>

                      <td
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="text-right pr-3"
                      >
                        <WishlistToggleInLink
                          tutorProfileId={String(id)}
                          initialActive={true}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
