"use client";

import React from "react";
import { Role } from "@/types/auth";
import { QuickRoleSwitcher } from "./QuickRoleSwitcher";
import {
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  Building,
} from "lucide-react";

interface TopbarProps {
  currentRole: Role;
  title?: string;
  subtitle?: string;
  userName?: string;
}

export function Topbar({
  currentRole,
  title = "Campus Operations Console",
  subtitle = "Real-time AI sustainability orchestration",
  userName = "Authorized User",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl">
      {/* Title & Subtitle / Breadcrumb */}
      <div>
        <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
      </div>

      {/* Right controls: Quick Role Switcher, Alerts, Profile */}
      <div className="flex items-center gap-3">
        {/* Instant RBAC Switcher for testing all 4 roles */}
        <QuickRoleSwitcher currentRole={currentRole} />

        {/* Notifications & AI Alerts */}
        <button
          title="System Alerts & Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
            3
          </span>
        </button>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 font-bold text-xs text-white shadow-md shadow-emerald-700/30">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
