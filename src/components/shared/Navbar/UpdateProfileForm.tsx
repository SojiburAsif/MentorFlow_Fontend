/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { updateMyProfileAction } from "@/services/auth.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, User, Phone, BookOpen, GraduationCap, DollarSign, PenTool, Layers, X } from "lucide-react";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

export default function UpdateProfileForm({ user, onUpdate }: { user: any, onUpdate?: (data: any) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>(() => {
    const fromNew = Array.isArray(user?.tutorProfile?.categories)
      ? user.tutorProfile.categories.map((x: any) => x?.categoryId ?? x?.category?.id).filter(Boolean)
      : [];
    const fromLegacy = user?.tutorProfile?.categoryId ? [user.tutorProfile.categoryId] : [];
    const merged = Array.from(new Set([...(fromNew as string[]), ...(fromLegacy as string[])])).slice(0, 4);
    return merged;
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name || user.studentProfile?.name || user.tutorProfile?.name || "",
      phone: user.phone || user.studentProfile?.phone || user.tutorProfile?.phone || "",
      bio: user.tutorProfile?.bio || user.bio || "",
      price: user.tutorProfile?.price || user.price || "",
      experience: user.tutorProfile?.experience || user.experience || "",
      institution: user.tutorProfile?.institution || user.studentProfile?.institution || user.institution || "",
      grade: user.studentProfile?.grade || user.grade || "",
      interests: user.studentProfile?.interests || user.interests || "",
    },
  });

  // Handle Image Preview
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  // Load categories for tutor multi-select
  useEffect(() => {
    if (user.role !== "TUTOR") return;
    (async () => {
      try {
        const r = await fetch("/api/categories", { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) return;
        setAllCategories(Array.isArray(j.data) ? j.data : []);
      } catch {
        // ignore
      }
    })();
  }, [user.role]);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        toast.error("You can select up to 4 categories");
        return prev;
      }
      return [...prev, id];
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let finalImgUrl = undefined;
      if (imageFile) {
        const toastId = toast.loading("Uploading image...");
        try {
          finalImgUrl = await uploadToImgbb(imageFile);
          toast.success("Image uploaded successfully!", { id: toastId });
        } catch (error) {
          toast.error("Image upload failed", { id: toastId });
          throw error;
        }
      }

      const cleanData: any = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          cleanData[key] = key === "price" ? Number(data[key]) : data[key];
        }
      });

      const res = await updateMyProfileAction({ 
        ...cleanData, 
        ...(finalImgUrl ? { image: finalImgUrl } : {}),
        ...(user.role === "TUTOR" ? { categoryIds } : {})
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        onUpdate?.(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      
      {/* Profile Picture Upload Section */}
      <div className="flex flex-col items-center justify-center gap-4 py-4 border-b border-dashed dark:border-slate-800">
        <div className="relative group">
          <img
            src={previewUrl || user.imgUrl || user.image || "https://github.com/shadcn.png"}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/10 border-2 border-white dark:border-slate-900 shadow-md"
            alt="Profile Preview"
          />
          <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-lg cursor-pointer text-white hover:bg-blue-700 transition-colors shadow-lg">
            <Camera className="w-4 h-4" />
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <p className="text-xs text-slate-500 font-medium">Click the camera icon to change photo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4" /> Name
          </Label>
          <Input required placeholder="Your Name" {...register("name")} className="bg-slate-50/50 dark:bg-slate-900/50" />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Phone className="w-4 h-4" /> Phone Number
          </Label>
          <Input placeholder="+88017..." {...register("phone")} className="bg-slate-50/50 dark:bg-slate-900/50" />
        </div>

        {/* Conditional Role Based Fields */}
        {user.role === "TUTOR" && (
          <>
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Layers className="w-4 h-4" /> Categories (up to 4)
              </Label>
              <div className="rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50 p-3">
                {allCategories.length === 0 ? (
                  <p className="text-xs text-slate-500">Categories not loaded yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((c: any) => {
                      const id = String(c.id);
                      const active = categoryIds.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleCategory(id)}
                          className={[
                            "h-9 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 transition-colors",
                            active
                              ? "bg-blue-600 text-white border-blue-700"
                              : "bg-white/60 dark:bg-black/20 border-slate-200/40 dark:border-slate-800 hover:bg-blue-600/10 hover:border-blue-600/30",
                          ].join(" ")}
                        >
                          {c.name}
                          {active && <X className="h-3.5 w-3.5 opacity-80" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {categoryIds.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-3">
                    Selected: <span className="font-bold">{categoryIds.length}</span>/4
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <PenTool className="w-4 h-4" /> Bio
              </Label>
              <Input placeholder="Short bio about your expertise" {...register("bio")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <BookOpen className="w-4 h-4" /> Experience
              </Label>
              <Input placeholder="e.g. 5 Years" {...register("experience")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <DollarSign className="w-4 h-4" /> Hourly Price
              </Label>
              <Input type="number" placeholder="1000" {...register("price")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <GraduationCap className="w-4 h-4" /> Institution
              </Label>
              <Input placeholder="University Name" {...register("institution")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
          </>
        )}

        {user.role === "STUDENT" && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <GraduationCap className="w-4 h-4" /> Grade / Level
              </Label>
              <Input placeholder="Class 10 / HSC" {...register("grade")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <BookOpen className="w-4 h-4" /> Institution
              </Label>
              <Input placeholder="School/College Name" {...register("institution")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <PenTool className="w-4 h-4" /> Interests
              </Label>
              <Input placeholder="Math, Science, Coding..." {...register("interests")} className="bg-slate-50/50 dark:bg-slate-900/50" />
            </div>
          </>
        )}
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-500/20" disabled={isLoading}>
        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Save Profile Changes"}
      </Button>
    </form>
  );
}