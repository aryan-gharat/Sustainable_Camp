import React from "react";
import {
  Zap,
  Droplets,
  Trash2,
  Trophy,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  ClipboardList,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconName?: "zap" | "droplets" | "trash" | "sparkles" | "trophy" | "leaf" | "activity" | "users" | "clipboardList";
  description?: string;
  category?: "energy" | "water" | "waste" | "ai" | "points";
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  droplets: Droplets,
  trash: Trash2,
  sparkles: Activity,
  trophy: Trophy,
  leaf: Leaf,
  activity: Activity,
  users: Users,
  clipboardList: ClipboardList,
};

export function MetricCard({
  title,
  value,
  unit,
  change,
  changeType = "positive",
  iconName = "activity",
  description,
  category = "energy",
  className,
}: MetricCardProps) {
  const Icon = ICON_MAP[iconName] || Activity;

  const categoryStyles = {
    energy: {
      border: "hover:border-amber-500/40",
      iconBg: "bg-amber-950/30 text-amber-400 border-amber-500/25",
      accent: "text-amber-400",
    },
    water: {
      border: "hover:border-sky-500/40",
      iconBg: "bg-sky-950/30 text-sky-400 border-sky-500/25",
      accent: "text-sky-400",
    },
    waste: {
      border: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-950/30 text-emerald-400 border-emerald-500/25",
      accent: "text-emerald-400",
    },
    ai: {
      border: "hover:border-slate-700",
      iconBg: "bg-slate-800/80 text-slate-300 border-slate-700",
      accent: "text-slate-300",
    },
    points: {
      border: "hover:border-teal-500/40",
      iconBg: "bg-teal-950/30 text-teal-400 border-teal-500/25",
      accent: "text-teal-400",
    },
  }[category];

  return (
    <Card
      className={cn(
        "pro-card transition-colors duration-150 border-slate-800 bg-[#0F1626]",
        categoryStyles.border,
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border",
              categoryStyles.iconBg
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-slate-400">{unit}</span>
          )}
        </div>

        {(change || description) && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs border-t border-slate-800/80 pt-2">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center font-medium text-[11px]",
                  changeType === "positive"
                    ? "text-emerald-400"
                    : changeType === "negative"
                    ? "text-rose-400"
                    : "text-slate-400"
                )}
              >
                {changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : changeType === "negative" ? (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                ) : null}
                {change}
              </span>
            )}
            {change && description && (
              <span className="text-slate-600">•</span>
            )}
            {description && (
              <span className="text-slate-400 text-[11px] truncate">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
