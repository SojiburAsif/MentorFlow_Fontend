/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/validations/auth.schema";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  User,
  Phone,
  Mail,
  Lock,
  X,
  Camera,
  ArrowRight,
  Briefcase,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { registerAction } from "@/services/auth.service";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    // @ts-expect-error schema mismatch handling
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "STUDENT",
      price: 0,
      experience: "0",
      bio: "",
    },
  });

  const selectedRole = watch("role");

  // Image selection handler with preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl("");
  };

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      let finalImgUrl: string | undefined = undefined;

      if (imageFile) {
        setIsUploading(true);
        finalImgUrl = await uploadToImgbb(imageFile);
      }

      const res = await registerAction({ ...data, imgUrl: finalImgUrl });

      if (res.success) {
        toast.success("Account created! Redirecting...", { id: toastId });
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

  const inputClass = "bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus:ring-blue-500 h-11 rounded-xl";

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="p-8 bg-white dark:bg-black rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-zinc-800">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
             <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Join MentorFlow</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 font-medium">Create an account to start your journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          
          {/* --- Image Upload Section --- */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-zinc-700 overflow-hidden bg-slate-50 dark:bg-zinc-900 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-lg transition-transform hover:scale-110">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <Camera className="w-4 h-4" />
              </label>
              {previewUrl && (
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-slate-400">Profile Photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="John Doe" className={`pl-10 ${inputClass}`} {...register("name")} />
              </div>
              {errors.name && <p className="text-[11px] text-red-500 font-medium ml-1">{String(errors.name.message)}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="name@example.com" className={`pl-10 ${inputClass}`} {...register("email")} />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 font-medium ml-1">{String(errors.email.message)}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="017XXXXXXXX" className={`pl-10 ${inputClass}`} {...register("phone")} />
              </div>
              {errors.phone && <p className="text-[11px] text-red-500 font-medium ml-1">{String(errors.phone.message)}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 ml-1">Secure Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="password" placeholder="••••••••" className={`pl-10 ${inputClass}`} {...register("password")} />
              </div>
              {errors.password && <p className="text-[11px] text-red-500 font-medium ml-1">{String(errors.password.message)}</p>}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 ml-1">I want to join as a</Label>
            <Select onValueChange={(val: any) => setValue("role", val)} defaultValue="STUDENT">
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="dark:bg-zinc-900 border-zinc-800">
                <SelectItem value="STUDENT">🎓 Student - I want to learn</SelectItem>
                <SelectItem value="TUTOR">👨‍🏫 Tutor - I want to teach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* --- Animated Tutor Section --- */}
          <AnimatePresence>
            {selectedRole === "TUTOR" && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="overflow-hidden"
              >
                <div className="p-6 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl space-y-4 my-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">
                    <Briefcase className="w-4 h-4" /> Professional Credentials
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-blue-600/70">Bio / Expertise</Label>
                    <Input placeholder="Expert in React, Node.js..." className="bg-white dark:bg-zinc-950" {...register("bio")} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-blue-600/70">Years of Exp.</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-300" />
                        <Input type="number" className="pl-9 bg-white dark:bg-zinc-950" {...register("experience")} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-blue-600/70">Hourly Rate (৳)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-300" />
                        <Input type="number" className="pl-9 bg-white dark:bg-zinc-950" {...register("price")} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terms */}
          <div className="flex items-start space-x-3 py-2 px-1">
            <Checkbox id="terms" required className="mt-1 border-slate-300 dark:border-zinc-700 data-[state=checked]:bg-blue-600" />
            <label htmlFor="terms" className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed cursor-pointer">
              I agree to the <Link href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95" 
            disabled={isLoading || isUploading}
          >
            {isLoading || isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {isUploading ? "Uploading Image..." : "Creating Account..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">Get Started Free <ArrowRight className="w-4 h-4" /></span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-900 text-center">
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}