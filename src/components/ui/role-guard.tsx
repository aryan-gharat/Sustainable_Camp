"use client";

import React from "react";
import { Role } from "@/types/auth";
import { ShieldAlert } from "lucide-react";

interface RoleGuardProps {
  currentRole: Role;
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  currentRole,
  allowedRoles,
  children,
  fallback,
}: RoleGuardProps) {
  const hasAccess =
    currentRole === "ADMIN" || allowedRoles.includes(currentRole);

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-6 text-center text-rose-300">
        <ShieldAlert className="mx-auto h-10 w-10 text-rose-400 mb-2 opacity-80" />
        <h3 className="text-base font-semibold text-white">Access Restricted</h3>
        <p className="text-xs text-rose-300/80 mt-1 max-w-sm mx-auto">
          This module requires elevated privileges. Your current role is{" "}
          <span className="font-semibold text-white">[{currentRole}]</span>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
