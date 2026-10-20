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
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-[#0A0E17] flex flex-col min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white border border-emerald-500/30">
            <Leaf className="h-4 w-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-100">
                GreenCampus
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-300 border border-slate-700">
                BMS
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Facilities & Energy Systems</p>
          </div>
        </Link>

        {/* Current Active Role Badge */}
        <div className="mt-3">
          <RoleBadge role={role} size="sm" className="w-full justify-center" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Operational Workspace
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
                "group flex items-center justify-between px-3 py-2 text-xs transition duration-150 rounded-md",
                isActive
                  ? "bg-slate-800/90 text-white font-medium border-l-2 border-emerald-500 rounded-l-none"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
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
                      ? "bg-rose-950/60 text-rose-300 border border-rose-800/50"
                      : item.badgeVariant === "eco"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/50"
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
      <div className="border-t border-slate-800 p-3 bg-[#0C1220]">
        <div className="flex items-center justify-between rounded-md bg-[#0F1626] p-2 border border-slate-800">
          <div className="min-w-0 flex-1 mr-2">
            <p className="truncate text-xs font-medium text-slate-200">
              {userName || "Active Operator"}
            </p>
            <p className="truncate text-[10px] text-slate-400">
              {userEmail || "facilities@greencampus.edu"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            RBAC Authenticated
          </span>
          <span>v2.4</span>
        </div>
      </div>
    </aside>
  );
}
