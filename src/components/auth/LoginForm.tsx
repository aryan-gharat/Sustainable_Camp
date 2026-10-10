"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Role } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  School,
  GraduationCap,
  Wrench,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_PRESETS: {
  role: Role;
  title: string;
  name: string;
  email: string;
  icon: typeof Shield;
  color: string;
}[] = [
  {
    role: "ADMIN",
    title: "Administrator",
    name: "Dr. Elena Vance",
    email: "admin@greencampus.ai",
    icon: Shield,
    color: "border-purple-500/40 hover:bg-purple-950/30 text-purple-300",
  },
  {
    role: "FACULTY",
    title: "Faculty / Research",
    name: "Prof. Marcus Thorne",
    email: "faculty@greencampus.ai",
    icon: School,
    color: "border-blue-500/40 hover:bg-blue-950/30 text-blue-300",
  },
  {
    role: "STUDENT",
    title: "Student Eco-Lead",
    name: "Aiden Sharma",
    email: "student@greencampus.ai",
    icon: GraduationCap,
    color: "border-emerald-500/40 hover:bg-emerald-950/30 text-emerald-300",
  },
  {
    role: "MAINTENANCE_STAFF",
    title: "Facilities Engineer",
    name: "Carlos Mendez",
    email: "maintenance@greencampus.ai",
    icon: Wrench,
    color: "border-amber-500/40 hover:bg-amber-950/30 text-amber-300",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const submitEmail = customEmail || email;
    const submitPass = customEmail ? "green2026!" : password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: submitEmail,
          password: submitPass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate.");
      }

      // Successful login -> route to requested redirect or default dashboard
      const target = redirectTarget || data.defaultRedirect || "/";
      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("green2026!");
    handleSubmit(undefined, presetEmail);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign In to GreenCampus AI
        </h2>
        <p className="text-xs text-slate-400">
          Enter institutional credentials to access your designated role console
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            Institutional Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@greencampus.ai"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <span className="text-[11px] text-emerald-400/80">Demo: green2026!</span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="eco"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            "Authenticate Session"
          )}
        </Button>
      </form>

      {/* 1-Click Role Presets */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-950 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            1-Click Role Quick Login
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_PRESETS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => handleSelectDemo(p.email)}
                disabled={loading}
                className={cn(
                  "flex flex-col items-start rounded-lg border p-2.5 text-left transition duration-200 bg-slate-900/60 backdrop-blur-sm",
                  p.color
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{p.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 truncate w-full">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Registration Link */}
      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Need an account?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
        >
          Register for Campus Access
        </Link>
      </div>
    </div>
  );
}
