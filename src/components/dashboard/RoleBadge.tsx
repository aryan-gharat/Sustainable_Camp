import React from "react";
import { Role } from "@/types/auth";
import { Shield, GraduationCap, School, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: Role;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RoleBadge({ role, className, size = "md" }: RoleBadgeProps) {
  const config = {
    ADMIN: {
      label: "Campus Administrator",
      shortLabel: "Admin",
      icon: Shield,
      bg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
      dot: "bg-purple-400",
    },
    FACULTY: {
      label: "Faculty & Research",
      shortLabel: "Faculty",
      icon: School,
      bg: "bg-blue-500/10 border-blue-500/30 text-blue-300",
      dot: "bg-blue-400",
    },
    STUDENT: {
      label: "Student Eco-Advocate",
      shortLabel: "Student",
      icon: GraduationCap,
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      dot: "bg-emerald-400",
    },
    MAINTENANCE_STAFF: {
      label: "Facilities Engineer",
      shortLabel: "Maintenance",
      icon: Wrench,
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
      dot: "bg-amber-400",
    },
  }[role];

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1.5",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-xs gap-2",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-medium tracking-tight",
        config.bg,
        sizeClasses,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span>{size === "sm" ? config.shortLabel : config.label}</span>
    </div>
  );
}
