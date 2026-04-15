import React from "react";
import LoginForm from "@/components/module/Auth/LoginForm";
import { Lock, Mail, Shield } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const next = typeof sp.next === "string" ? sp.next : "";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden 
    bg-white dark:bg-black transition-colors">

      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.25),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.35),transparent_60%)]" />

      {/* 🔥 Floating Icons */}
      <Lock className="absolute top-10 left-10 text-blue-500/20 w-20 h-20 animate-pulse" />
      <Mail className="absolute bottom-10 right-10 text-blue-500/20 w-20 h-20 animate-pulse" />
      <Shield className="absolute top-1/2 left-1/3 text-blue-500/10 w-28 h-28 animate-pulse" />

      {/* CONTENT */}
      <div className="relative z-10 w-full px-4">
        <LoginForm nextUrl={next || undefined} />
      </div>
    </div>
  );
}
