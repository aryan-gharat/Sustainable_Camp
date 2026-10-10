"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@/types/auth";
import { ROLE_NAVIGATION, ROLE_CONFIGS } from "@/lib/rbac";
import { RoleBadge } from "./RoleBadge";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Sparkles,
  Users,
  Settings,
  Trophy,
  Flame,
  Medal,
  AlertTriangle,
  Zap,
  Microscope,
  Coins,
  FileSpreadsheet,
  ClipboardList,
  Cpu,
  Droplets,
  CalendarClock,
  LogOut,
  Leaf,
  ShieldCheck,
  FileText,
  Calendar,
  Gift,
  Calculator,
  GraduationCap,
  FileCheck,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: Role;
  userName?: string;
  userEmail?: string;
}

const ICON_COMPONENTS: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  Building2,
  Sparkles,
  Users,
  Settings,
  Trophy,
  Flame,
  Medal,
  AlertTriangle,
  Zap,
  Microscope,
  Coins,
  FileSpreadsheet,
  ClipboardList,
  Cpu,
  Droplets,
  CalendarClock,
  FileText,
  Calendar,
  Gift,
  Calculator,
  GraduationCap,
  FileCheck,
};

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = ROLE_NAVIGATION[role] || [];
  const roleConfig = ROLE_CONFIGS[role];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition duration-300">
            <Leaf className="h-5 w-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">
                GreenCampus
              </span>
              <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-extrabold uppercase text-emerald-400 border border-emerald-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Sustainable OS</p>
          </div>
        </Link>

        {/* Current Active Role Badge */}
        <div className="mt-4">
          <RoleBadge role={role} size="md" className="w-full justify-center" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Role Workspaces
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = ICON_COMPONENTS[item.iconName] || LayoutDashboard;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-500/15 text-white border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-400 group-hover:text-slate-300"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                    item.badgeVariant === "destructive"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : item.badgeVariant === "eco"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Session Footer & Logout */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/40">
        <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-2.5 border border-slate-800">
          <div className="min-w-0 flex-1 mr-2">
            <p className="truncate text-xs font-semibold text-white">
              {userName || "Active Operator"}
            </p>
            <p className="truncate text-[10px] text-slate-400">
              {userEmail || "campus.greencampus.ai"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between px-1 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            RBAC Guard Active
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
