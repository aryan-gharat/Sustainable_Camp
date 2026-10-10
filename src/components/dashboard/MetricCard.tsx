import React from "react";
import {
  Zap,
  Droplets,
  Trash2,
  Sparkles,
  Trophy,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  ClipboardList,
  LucideIcon,
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
  sparkles: Sparkles,
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
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      accent: "text-amber-400",
    },
    water: {
      border: "hover:border-sky-500/40",
      iconBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      accent: "text-sky-400",
    },
    waste: {
      border: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accent: "text-emerald-400",
    },
    ai: {
      border: "hover:border-purple-500/40",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      accent: "text-purple-400",
    },
    points: {
      border: "hover:border-teal-500/40",
      iconBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      accent: "text-teal-400",
    },
  }[category];

  return (
    <Card
      className={cn(
        "glass-card relative overflow-hidden transition-all duration-300",
        categoryStyles.border,
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border",
              categoryStyles.iconBg
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-slate-400">{unit}</span>
          )}
        </div>

        {(change || description) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center font-medium",
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
            {description && (
              <span className="text-slate-400/90 truncate">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
