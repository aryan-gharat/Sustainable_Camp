import { Role } from "./auth";

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "eco";
  description?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconName: string;
  description?: string;
  category?: "energy" | "water" | "waste" | "ai" | "points";
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  iconName: string;
  role: Role;
}
