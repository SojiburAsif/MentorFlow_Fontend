"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/validations/auth.schema";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { loginAction } from "@/services/auth.service";
import MainLogo from "@/components/shared/logo/MainLogo";

export default function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      const res = await loginAction(data);
      if (res.success) {
        toast.success("Welcome back!", { id: toastId });
        window.location.assign(nextUrl || "/dashboard");
      } else {
        toast.error(res.message || "Invalid credentials", { id: toastId });
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto relative z-10"
    >
      <div className="p-8 rounded-3xl border shadow-2xl backdrop-blur-xl 
      bg-white/80 dark:bg-black/60 
      border-slate-200 dark:border-white/10">

        {/* HEADER */}
        {/* HEADER */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-4"
          >
           
              <MainLogo />
           
          </motion.div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Sign in to continue your journey 
          </p>
        </div>


        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Enter Your Email"
                className="pl-10 h-11 bg-white/70 dark:bg-black/40 border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-blue-500"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{String(errors.email.message)}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Password
              </Label>
              <Link href="#" className="text-xs text-blue-500 hover:underline">
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="password"
                className="pl-10 h-11 bg-white/70 dark:bg-black/40 border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-blue-500"
                {...register("password")}
              />
            </div>

            {errors.password && (
              <p className="text-xs text-red-500">{String(errors.password.message)}</p>
            )}
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition active:scale-[0.97]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
          <p className="text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-500 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
