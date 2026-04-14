/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { updateMyProfileAction } from "@/services/auth.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Loader2, Camera, User, Phone, BookOpen, GraduationCap, 
  DollarSign, PenTool, Layers, X, Activity, ArrowUpRight 
} from "lucide-react";
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
    return Array.from(new Set([...(fromNew as string[]), ...(fromLegacy as string[])])).slice(0, 4);
  });
  const [tutorStatus, setTutorStatus] = useState<string>(user?.tutorProfile?.status ?? "ACTIVE");

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

  // Load categories for tutor
  useEffect(() => {
    if (user.role !== "TUTOR") return;
    (async () => {
      try {
        const r = await fetch("/api/categories", { cache: "no-store" });
        const j = await r.json();
        if (j.success) setAllCategories(Array.isArray(j.data) ? j.data : []);
      } catch (e) {
        console.error("Failed to fetch categories");
      }
    })();
  }, [user.role]);

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) {
        toast.error("Maximum 4 categories allowed");
        return prev;
      }
      return [...prev, id];
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const toastId = toast.loading("Processing updates...");
    try {
      let finalImgUrl = undefined;
      if (imageFile) {
        finalImgUrl = await uploadToImgbb(imageFile);
      }

      const cleanData: any = {};
      Object.keys(data).forEach(key => {
        if (data[key] !== "" && data[key] !== null) {
          cleanData[key] = key === "price" ? Number(data[key]) : data[key];
        }
      });

      const res = await updateMyProfileAction({ 
        ...cleanData, 
        ...(finalImgUrl ? { image: finalImgUrl } : {}),
        ...(user.role === "TUTOR" ? { categoryIds, tutorStatus } : {})
      });

      if (res.success) {
        toast.success("Identity profile updated!", { id: toastId });
        onUpdate?.(res.data);
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (e: any) {
      toast.error("An error occurred during update", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle = "text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2";
  const inputStyle = "bg-black/40 border-white/5 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-11 text-xs font-medium placeholder:text-slate-700 transition-all text-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 custom-scrollbar">
      
      {/* --- PHOTO UPLOAD SECTION --- */}
      <div className="flex flex-col items-center gap-4 py-6 border-b border-white/5 relative">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <img
            src={previewUrl || user.imgUrl || user.image || "https://github.com/shadcn.png"}
            className="relative w-28 h-28 rounded-2xl object-cover border border-white/10 shadow-2xl"
            alt="User Avatar"
          />
          <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl cursor-pointer text-white hover:bg-blue-500 transition-all shadow-xl border border-white/10">
            <Camera size={14} />
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="text-center">
           <p className="text-[10px] font-black text-white uppercase tracking-widest">Digital Identity Avatar</p>
           <p className="text-[8px] text-slate-600 uppercase mt-1">System supported: PNG, JPG, WEBP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label className={labelStyle}><User size={10} className="text-blue-500" /> Full Name</Label>
          <Input required placeholder="Enter full name" {...register("name")} className={inputStyle} />
        </div>

        {/* Communications */}
        <div className="space-y-2">
          <Label className={labelStyle}><Phone size={10} className="text-blue-500" /> Contact Number</Label>
          <Input placeholder="+880..." {...register("phone")} className={inputStyle} />
        </div>

        {/* --- TUTOR SPECIFIC FIELDS --- */}
        {user.role === "TUTOR" && (
          <>
            <div className="space-y-4 md:col-span-2 bg-black/30 p-5 rounded-2xl border border-white/5">
              <Label className={labelStyle}><Layers size={10} className="text-blue-500" /> Expertise Matrix (Max 4)</Label>
              <div className="flex flex-wrap gap-2">
                {allCategories.length === 0 ? (
                  <div className="text-[10px] text-slate-700 animate-pulse uppercase font-bold tracking-widest">Loading subject data...</div>
                ) : (
                  allCategories.map((c: any) => {
                    const id = String(c.id);
                    const isActive = categoryIds.includes(id);
                    return (
                      <button
                        key={id} type="button"
                        onClick={() => toggleCategory(id)}
                        className={`h-8 px-3 rounded-lg border text-[9px] font-black transition-all flex items-center gap-2 ${
                          isActive 
                            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                            : "bg-white/5 border-white/5 text-slate-500 hover:border-blue-500/30 hover:text-slate-300"
                        }`}
                      >
                        {c.name} {isActive && <X size={10} />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className={labelStyle}><Activity size={10} className="text-blue-500" /> Availability Status</Label>
              <select 
                value={tutorStatus} 
                onChange={(e) => setTutorStatus(e.target.value)} 
                className={`${inputStyle} w-full px-3 outline-none appearance-none`}
              >
                <option value="ACTIVE" className="bg-[#0a0a14]">Public (Active)</option>
                <option value="INACTIVE" className="bg-[#0a0a14]">Private (Paused)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className={labelStyle}><DollarSign size={10} className="text-blue-500" /> Hourly Rate</Label>
              <Input type="number" placeholder="0.00" {...register("price")} className={inputStyle} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className={labelStyle}><PenTool size={10} className="text-blue-500" /> Professional Bio</Label>
              <Input placeholder="Describe your teaching methodology..." {...register("bio")} className={inputStyle} />
            </div>

            <div className="space-y-2">
              <Label className={labelStyle}><BookOpen size={10} className="text-blue-500" /> Experience</Label>
              <Input placeholder="e.g. 4 Years" {...register("experience")} className={inputStyle} />
            </div>

            <div className="space-y-2">
              <Label className={labelStyle}><GraduationCap size={10} className="text-blue-500" /> Institution</Label>
              <Input placeholder="University/Organization" {...register("institution")} className={inputStyle} />
            </div>
          </>
        )}

        {/* --- STUDENT SPECIFIC FIELDS --- */}
        {user.role === "STUDENT" && (
          <>
            <div className="space-y-2">
              <Label className={labelStyle}><GraduationCap size={10} className="text-blue-500" /> Academic Grade</Label>
              <Input placeholder="Class / Level" {...register("grade")} className={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label className={labelStyle}><BookOpen size={10} className="text-blue-500" /> Current Institution</Label>
              <Input placeholder="School/College" {...register("institution")} className={inputStyle} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className={labelStyle}><PenTool size={10} className="text-blue-500" /> Learning Interests</Label>
              <Input placeholder="Subjects you want to master..." {...register("interests")} className={inputStyle} />
            </div>
          </>
        )}
      </div>

      {/* --- SUBMIT ACTION --- */}
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] h-12 rounded-xl shadow-lg shadow-blue-500/10 group overflow-hidden relative" 
        disabled={isLoading}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
           {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Commit Changes <ArrowUpRight size={14} /></>}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
      </Button>
    </form>
  );
}