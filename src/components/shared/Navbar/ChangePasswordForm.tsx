/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Lock, 
  ShieldCheck,  
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ChangePasswordForm({ onDone }: { onDone?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const oldPassword = String(form.get("oldPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (!oldPassword || !newPassword) {
      toast.error("All fields are required", { icon: <AlertCircle className="w-4 h-4" /> });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, revokeOtherSessions }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server sent an invalid response format");
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Failed to update password");
      }

      toast.success(data.message || "Password updated successfully!", {
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
      });
      
      onDone?.();
    } catch (error: any) {
      console.error("Change Password Error:", error);
      toast.error(error.message || "Connection failed. Please check your internet or server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit} 
      className="space-y-6 max-w-md mx-auto"
    >
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Security Update</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Keep your account safe by using a strong, unique password.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Old Password */}
        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold ml-1">Current Password</Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={16} />
            </div>
            <Input
              name="oldPassword"
              type={showOld ? "text" : "password"}
              placeholder="••••••••"
              required
              className="pl-11 pr-12 h-12 rounded-xl bg-white dark:bg-black border-slate-200 dark:border-white/10 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400"
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold ml-1">New Password</Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={16} />
            </div>
            <Input
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Min. 6 characters"
              required
              className="pl-11 pr-12 h-12 rounded-xl bg-white dark:bg-black border-slate-200 dark:border-white/10 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold ml-1">Confirm New Password</Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={16} />
            </div>
            <Input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat new password"
              required
              className="pl-11 pr-12 h-12 rounded-xl bg-white dark:bg-black border-slate-200 dark:border-white/10 focus:ring-blue-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Revoke Sessions Toggle */}
      <button
        type="button"
        onClick={() => setRevokeOtherSessions((v) => !v)}
        className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 flex items-center gap-4 ${
          revokeOtherSessions
            ? "border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20"
            : "border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.02]"
        }`}
      >
        {/* FIX: এখানে আইকনটি মিসিং ছিল */}
        <div className={`p-2 rounded-xl transition-colors ${revokeOtherSessions ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
        
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Log out other devices</p>
          <p className="text-[11px] text-slate-500 font-medium">
            {revokeOtherSessions ? "All other active sessions will be terminated." : "Keep me logged in on other devices."}
          </p>
        </div>
        <div className={`w-2 h-2 rounded-full ${revokeOtherSessions ? 'bg-blue-500 animate-pulse' : 'bg-slate-300 dark:bg-white/20'}`} />
      </button>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating Password...</span>
          </div>
        ) : (
          "Save Changes"
        )}
      </Button>
    </motion.form>
  );
}