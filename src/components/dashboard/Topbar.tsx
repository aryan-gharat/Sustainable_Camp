"use client";

import React from "react";
import { Role } from "@/types/auth";
import { QuickRoleSwitcher } from "./QuickRoleSwitcher";
import { Bell } from "lucide-react";

interface TopbarProps {
  currentRole: Role;
  title?: string;
  subtitle?: string;
  userName?: string;
}

export function Topbar({
  currentRole,
  title = "Campus Operations Console",
  subtitle = "Campus Energy & Resource Information System",
  userName = "Authorized Operator",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-[#0C1220] px-6">
      {/* Title & Subtitle / Breadcrumb */}
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2">
          {title}
        </h1>
        <p className="text-[11px] text-slate-400 hidden sm:block">{subtitle}</p>
      </div>

      {/* Right controls: Quick Role Switcher, Alerts, Profile */}
      <div className="flex items-center gap-3">
        {/* Instant RBAC Switcher for testing all 4 roles */}
        <QuickRoleSwitcher currentRole={currentRole} />

        {/* Notifications & System Alerts */}
        <button
          title="Facility Alerts"
          className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-[#0F1626] text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        {/* User Mini Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800 border border-slate-700 font-semibold text-xs text-slate-200">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
