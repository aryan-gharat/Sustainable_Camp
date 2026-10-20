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
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_PRESETS: {
  role: Role;
  title: string;
  name: string;
  email: string;
  icon: typeof Shield;
}[] = [
  {
    role: "ADMIN",
    title: "Campus Administrator",
    name: "Dr. Elena Vance",
    email: "admin@greencampus.ai",
    icon: Shield,
  },
  {
    role: "FACULTY",
    title: "Faculty & Researcher",
    name: "Prof. Marcus Thorne",
    email: "faculty@greencampus.ai",
    icon: School,
  },
  {
    role: "STUDENT",
    title: "Student Representative",
    name: "Aiden Sharma",
    email: "student@greencampus.ai",
    icon: GraduationCap,
  },
  {
    role: "MAINTENANCE_STAFF",
    title: "Facilities Specialist",
    name: "Carlos Mendez",
    email: "maintenance@greencampus.ai",
    icon: Wrench,
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
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          GreenCampus Operations
        </h2>
        <p className="text-xs text-slate-400">
          Enter institutional credentials to access your designated facilities console
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-md border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
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
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@university.edu"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <span className="text-[11px] text-slate-400">Default: green2026!</span>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
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
              Verifying Credentials...
            </>
          ) : (
            "Sign In to Operations"
          )}
        </Button>
      </form>

      {/* 1-Click Role Presets */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-[#090D16] px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            Evaluation Profiles
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
                className="flex flex-col items-start rounded-md border border-slate-800 bg-[#0F1626] p-2.5 text-left transition hover:border-slate-700 hover:bg-[#141E34]"
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-200">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-medium">{p.title}</span>
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
        Need campus credentials?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
        >
          Register New Account
        </Link>
      </div>
    </div>
  );
}
