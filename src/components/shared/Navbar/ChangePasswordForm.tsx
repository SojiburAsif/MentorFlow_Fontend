"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";

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
      toast.error("Old and new password are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const r = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, revokeOtherSessions }),
      });
      const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
      if (!r.ok || !j.success) {
        const msg =
          j.message ||
          j.error ||
          (Array.isArray(j.errorSources) && j.errorSources[0]?.message) ||
          "Failed to change password";
        toast.error(msg);
        return;
      }
      toast.success(j.message || "Password changed successfully.");
      onDone?.();
    } catch {
      toast.error("Server unreachable. Please start backend and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-2xl border border-slate-200/10 bg-slate-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 dark:text-white">Update your password</p>
            <p className="text-xs text-slate-500 mt-1">
              Use a strong password (min 6 characters). You can optionally log out other devices.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Lock className="w-4 h-4" /> Old password
        </Label>
        <div className="relative">
          <Input
            name="oldPassword"
            type={showOld ? "text" : "password"}
            placeholder="Enter old password"
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowOld((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center"
            aria-label={showOld ? "Hide old password" : "Show old password"}
          >
            {showOld ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Lock className="w-4 h-4" /> New password
        </Label>
        <div className="relative">
          <Input
            name="newPassword"
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center"
            aria-label={showNew ? "Hide new password" : "Show new password"}
          >
            {showNew ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Lock className="w-4 h-4" /> Confirm new password
        </Label>
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter new password"
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRevokeOtherSessions((v) => !v)}
        className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
          revokeOtherSessions
            ? "border-blue-500/30 bg-blue-500/10"
            : "border-slate-200/10 bg-slate-500/5 hover:bg-slate-500/10"
        }`}
      >
        <p className="text-sm font-black text-slate-900 dark:text-white">Log out other devices</p>
        <p className="text-xs text-slate-500 mt-1">
          {revokeOtherSessions ? "Enabled: other sessions will be revoked." : "Off: you stay logged in everywhere."}
        </p>
      </button>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-500/20"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...
          </>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}

