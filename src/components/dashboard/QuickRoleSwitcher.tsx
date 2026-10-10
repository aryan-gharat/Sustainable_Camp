"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/auth";
import { ROLE_CONFIGS } from "@/lib/rbac";
import {
  Shield,
  GraduationCap,
  School,
  Wrench,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickRoleSwitcherProps {
  currentRole: Role;
}

const ROLES_LIST: {
  role: Role;
  name: string;
  email: string;
  icon: typeof Shield;
}[] = [
  {
    role: "ADMIN",
    name: "Dr. Elena Vance (Admin)",
    email: "admin@greencampus.ai",
    icon: Shield,
  },
  {
    role: "FACULTY",
    name: "Prof. Marcus Thorne (Faculty)",
    email: "faculty@greencampus.ai",
    icon: School,
  },
  {
    role: "STUDENT",
    name: "Aiden Sharma (Student)",
    email: "student@greencampus.ai",
    icon: GraduationCap,
  },
  {
    role: "MAINTENANCE_STAFF",
    name: "Carlos Mendez (Facilities)",
    email: "maintenance@greencampus.ai",
    icon: Wrench,
  },
];

export function QuickRoleSwitcher({ currentRole }: QuickRoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const handleSwitchRole = async (targetRole: Role, email: string) => {
    if (targetRole === currentRole) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "green2026!",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsOpen(false);
        router.push(data.defaultRedirect);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to switch role:", err);
    } finally {
      setIsSwitching(false);
    }
  };

  const currentRoleInfo = ROLE_CONFIGS[currentRole];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
          isSwitching && "opacity-70 cursor-wait"
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
        <span className="hidden sm:inline text-slate-400">Viewing as:</span>
        <span className="font-semibold text-white">
          {currentRoleInfo?.displayName || currentRole}
        </span>
        <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/50">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-xs font-semibold text-white">
                Role-Based Access Control Switcher
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Instant test simulation across all 4 authorized roles
              </p>
            </div>

            <div className="py-1">
              {ROLES_LIST.map((item) => {
                const isSelected = item.role === currentRole;
                const Icon = item.icon;

                return (
                  <button
                    key={item.role}
                    onClick={() => handleSwitchRole(item.role, item.email)}
                    disabled={isSwitching}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition",
                      isSelected
                        ? "bg-emerald-950/40 text-emerald-300 font-semibold border border-emerald-500/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md border",
                          isSelected
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.role}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-1 border-t border-slate-800 pt-2 px-3 pb-1 text-[11px] text-slate-400">
              Passes through Next.js 15 JWT auth cookies & middleware
            </div>
          </div>
        </>
      )}
    </div>
  );
}
