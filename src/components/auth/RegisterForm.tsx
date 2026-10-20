"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  User,
  Building,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: {
  role: Role;
  title: string;
  desc: string;
  icon: typeof Shield;
}[] = [
  {
    role: "STUDENT",
    title: "Student",
    desc: "Earn eco-points, participate in dorm challenges",
    icon: GraduationCap,
  },
  {
    role: "FACULTY",
    title: "Faculty",
    desc: "Classroom energy limits, lab audits & research grants",
    icon: School,
  },
  {
    role: "ADMIN",
    title: "Campus Admin",
    desc: "Institutional governance, policies & ESG audit",
    icon: Shield,
  },
  {
    role: "MAINTENANCE_STAFF",
    title: "Maintenance",
    desc: "Dispatch work orders, calibrate IoT meters & HVAC",
    icon: Wrench,
  },
];

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [department, setDepartment] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          department: department || undefined,
          studentId: role === "STUDENT" ? idNumber : undefined,
          staffId: role !== "STUDENT" ? idNumber : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      router.push(data.defaultRedirect || "/");
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

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Register Institutional Access
        </h2>
        <p className="text-xs text-slate-400">
          Create verified campus credentials for facility operations and energy analytics
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-md border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector Cards */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Select Designated Campus Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((item) => {
              const isSelected = role === item.role;
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.role}
                  onClick={() => setRole(item.role)}
                  className={cn(
                    "flex flex-col text-left p-3 rounded-lg border transition",
                    isSelected
                      ? "bg-slate-800 border-emerald-500/80 text-white shadow-sm"
                      : "bg-[#0F1626] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "text-emerald-400" : "text-slate-400"
                      )}
                    />
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Campus Email (.edu)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arivera@university.edu"
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Department & ID Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Department / Faculty
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Environmental Sciences"
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              {role === "STUDENT" ? "Student ID #" : "Staff / Faculty ID #"}
            </label>
            <Input
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g. GC-99420"
              className="text-xs"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">
            Password (Min. 6 characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9 text-xs"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="eco"
          className="w-full mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering Account...
            </>
          ) : (
            "Complete Registration & Enter Console"
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
        >
          Sign in with existing credentials
        </Link>
      </div>
    </div>
  );
}
