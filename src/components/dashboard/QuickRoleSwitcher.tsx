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
  UserCheck,
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
          "flex items-center gap-2 rounded-md border border-slate-800 bg-[#0F1626] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800 hover:border-slate-700 focus:outline-none",
          isSwitching && "opacity-70 cursor-wait"
        )}
      >
        <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span className="hidden sm:inline text-slate-400">Profile:</span>
        <span className="font-semibold text-slate-100">
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
          <div className="absolute right-0 z-50 mt-1.5 w-72 origin-top-right rounded-lg border border-slate-700 bg-[#0F1626] p-2 shadow-xl ring-1 ring-black/40">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-xs font-semibold text-slate-100">
                Switch Operational Profile
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Review permissions across authorized roles
              </p>
            </div>

            <div className="py-1 space-y-0.5">
              {ROLES_LIST.map((item) => {
                const isSelected = item.role === currentRole;
                const Icon = item.icon;

                return (
                  <button
                    key={item.role}
                    onClick={() => handleSwitchRole(item.role, item.email)}
                    disabled={isSwitching}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition",
                      isSelected
                        ? "bg-slate-800 text-slate-100 font-medium border border-slate-700"
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded border",
                          isSelected
                            ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-400"
                            : "bg-slate-800/80 border-slate-700 text-slate-400"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-200">{item.name}</div>
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

            <div className="mt-1 border-t border-slate-800 pt-2 px-3 pb-1 text-[10px] text-slate-400">
              Authenticated via HTTP-only JWT sessions
            </div>
          </div>
        </>
      )}
    </div>
  );
}
