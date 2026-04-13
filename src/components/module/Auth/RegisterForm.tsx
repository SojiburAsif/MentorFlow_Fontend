/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/validations/auth.schema";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, User, Phone, Mail, Lock, Camera, ArrowRight, Briefcase } from "lucide-react";
import { registerAction } from "@/services/auth.service";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    // @ts-expect-error schema mismatch
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "", email: "", password: "", phone: "", role: "STUDENT", price: 0,
    },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");
    
    try {
      let finalImgUrl: string | undefined = undefined;
      
      if (imageFile) {
        setIsUploading(true);
        toast.loading("Uploading profile image...", { id: toastId });
        finalImgUrl = await uploadToImgbb(imageFile);
        setIsUploading(false);
      }

      const res = await registerAction({ ...data, imgUrl: finalImgUrl });
      
      if (res.success) {
        toast.success("Account created! Redirecting...", { id: toastId });
        // Force reload so server components read fresh httpOnly cookies
        window.location.assign("/dashboard");
      } else {
        toast.error(res.message || "Registration failed", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-1">
      <div className="p-8 bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Join MentorFlow</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Unlock your potential today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="John Doe" className="pl-10 bg-slate-50/50 dark:bg-slate-900/50" {...register("name")} />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-medium">{String(errors.name.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input placeholder="017..." className="pl-10 bg-slate-50/50 dark:bg-slate-900/50" {...register("phone")} />
              </div>
              {errors.phone && <p className="text-xs text-red-500 font-medium">{String(errors.phone.message)}</p>}
            </div>
          </div>

          {/* Row 2: Email & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="email" placeholder="john@example.com" className="pl-10 bg-slate-50/50 dark:bg-slate-900/50" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{String(errors.email.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Profile Image</Label>
              <div className="relative cursor-pointer">
                <Camera className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="file" accept="image/*" className="pl-10 bg-slate-50/50 dark:bg-slate-900/50 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          </div>

          {/* Row 3: Password & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="password" placeholder="••••••••" className="pl-10 bg-slate-50/50 dark:bg-slate-900/50" {...register("password")} />
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium">{String(errors.password.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Join As</Label>
              <Select onValueChange={(val: any) => setValue("role", val)} defaultValue="STUDENT">
                <SelectTrigger className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="STUDENT">🎓 Student</SelectItem>
                  <SelectItem value="TUTOR">👨‍🏫 Tutor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tutor Fields Section */}
          {selectedRole === "TUTOR" && (
            <div className="p-5 border-2 border-dashed border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2">
                <Briefcase className="w-4 h-4" /> Professional Information
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-blue-600/70">Expertise Bio</Label>
                <Input placeholder="Tell us about your skills..." className="bg-white dark:bg-zinc-950" {...register("bio")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-blue-600/70">Experience (Years)</Label>
                  <Input type="number" placeholder="2" className="bg-white dark:bg-zinc-950" {...register("experience")} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-blue-600/70">Rate (৳/hr)</Label>
                  <Input type="number" placeholder="500" className="bg-white dark:bg-zinc-950" {...register("price")} />
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2 py-2">
            <Checkbox id="terms" required className="mt-1 border-slate-300 dark:border-slate-700 data-[state=checked]:bg-blue-600" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-normal cursor-pointer">
                I agree to the <Link href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all" disabled={isLoading || isUploading}>
            {isLoading || isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {isUploading ? "Uploading Image..." : "Processing..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">Create My Account <ArrowRight className="w-4 h-4" /></span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already a member?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}