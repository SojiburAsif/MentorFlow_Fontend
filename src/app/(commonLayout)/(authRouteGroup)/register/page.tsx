import React from "react";
import RegisterForm from "@/components/module/Auth/RegisterForm";
import { Sparkles, Shield, GraduationCap } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white transition-colors dark:bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.28),transparent_55%)]" />

      <Sparkles className="absolute left-8 top-12 h-20 w-20 text-blue-500/15 animate-pulse" />
      <Shield className="absolute right-10 top-24 h-24 w-24 text-blue-500/10 animate-pulse" />
      <GraduationCap className="absolute bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 text-blue-500/10 animate-pulse" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <RegisterForm />
      </div>
    </div>
  );
}
