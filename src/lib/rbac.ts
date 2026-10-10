import { Role, RoleConfig } from "@/types/auth";
import { NavItem } from "@/types/dashboard";

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  ADMIN: {
    role: "ADMIN",
    displayName: "Campus Administrator",
    tagline: "Total institutional sustainability & AI telemetry governance",
    defaultRoute: "/admin/dashboard",
    allowedPrefixes: [
      "/admin",
      "/faculty",
      "/student",
      "/maintenance",
      "/api",
    ],
    themeColor: {
      bg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      text: "text-purple-400",
      border: "border-purple-500/30",
      badge: "bg-purple-900/60 text-purple-200 border-purple-500/40",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    },
  },
  FACULTY: {
    role: "FACULTY",
    displayName: "Faculty & Researcher",
    tagline: "Academic labs, sustainability grants, and smart classroom analytics",
    defaultRoute: "/faculty/dashboard",
    allowedPrefixes: ["/faculty", "/student", "/api"],
    themeColor: {
      bg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      text: "text-blue-400",
      border: "border-blue-500/30",
      badge: "bg-blue-900/60 text-blue-200 border-blue-500/40",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    },
  },
  STUDENT: {
    role: "STUDENT",
    displayName: "Student Eco-Advocate",
    tagline: "Gamified carbon footprint, green quests, and campus action",
    defaultRoute: "/student/dashboard",
    allowedPrefixes: ["/student", "/api"],
    themeColor: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      badge: "bg-emerald-900/60 text-emerald-200 border-emerald-500/40",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
    },
  },
  MAINTENANCE_STAFF: {
    role: "MAINTENANCE_STAFF",
    displayName: "Maintenance Engineer",
    tagline: "IoT telemetry, smart leak detection, and HVAC work orders",
    defaultRoute: "/maintenance/dashboard",
    allowedPrefixes: ["/maintenance", "/api"],
    themeColor: {
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      text: "text-amber-400",
      border: "border-amber-500/30",
      badge: "bg-amber-900/60 text-amber-200 border-amber-500/40",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    },
  },
};

export const ROLE_NAVIGATION: Record<Role, NavItem[]> = {
  ADMIN: [
    {
      title: "Executive Command Center",
      href: "/admin/dashboard",
      iconName: "LayoutDashboard",
      description: "Aggregated campus ESG metrics & governance overview",
    },
    {
      title: "User Management & RBAC",
      href: "/admin/users",
      iconName: "Users",
      badge: "RBAC Active",
      badgeVariant: "default",
      description: "Create, assign roles & govern user access",
    },
    {
      title: "Department Management",
      href: "/admin/departments",
      iconName: "GraduationCap",
      badge: "ESG Budgets",
      badgeVariant: "eco",
      description: "Department ESG targets, carbon limits & student rosters",
    },
    {
      title: "Building Infrastructure",
      href: "/admin/buildings",
      iconName: "Building2",
      badge: "IoT Meters",
      badgeVariant: "secondary",
      description: "Manage facilities, solar arrays & smart energy meters",
    },
    {
      title: "Campus Analytics",
      href: "/admin/analytics",
      iconName: "BarChart3",
      badge: "Live Telemetry",
      badgeVariant: "eco",
      description: "Institutional power, solar, water & carbon telemetry",
    },
    {
      title: "Report Approval Workflow",
      href: "/admin/reports",
      iconName: "FileCheck",
      badge: "Governance",
      badgeVariant: "destructive",
      description: "Approve student & faculty eco reports & dispatch work orders",
    },
  ],
  STUDENT: [
    {
      title: "Dashboard",
      href: "/student/dashboard",
      iconName: "LayoutDashboard",
      description: "Personal carbon metrics, active streak & eco-points hub",
    },
    {
      title: "Sustainability Reports",
      href: "/student/reports",
      iconName: "FileText",
      badge: "Submit & Track",
      badgeVariant: "eco",
      description: "Report campus environmental hazards and track audit logs",
    },
    {
      title: "Events",
      href: "/student/events",
      iconName: "Calendar",
      badge: "Upcoming",
      badgeVariant: "default",
      description: "Green drives, tree planting & zero-waste workshops",
    },
    {
      title: "Rewards",
      href: "/student/rewards",
      iconName: "Gift",
      badge: "Vouchers",
      badgeVariant: "secondary",
      description: "Redeem eco-points for dining, bookstore & commute vouchers",
    },
    {
      title: "Carbon Footprint Calculator",
      href: "/student/calculator",
      iconName: "Calculator",
      description: "Personal annual carbon emission calculator & AI recommendations",
    },
    {
      title: "Leaderboard",
      href: "/student/leaderboard",
      iconName: "Medal",
      description: "Dormitory, individual & departmental green rankings",
    },
  ],
  FACULTY: [
    {
      title: "Faculty Dashboard",
      href: "/faculty/dashboard",
      iconName: "LayoutDashboard",
      description: "Departmental ESG command center & overview",
    },
    {
      title: "Department Analytics",
      href: "/faculty/analytics",
      iconName: "BarChart3",
      badge: "Live Telemetry",
      badgeVariant: "eco",
      description: "Power, water & carbon metrics for department labs",
    },
    {
      title: "Student Participation",
      href: "/faculty/student-tracking",
      iconName: "Users",
      badge: "Gamified",
      badgeVariant: "default",
      description: "Track student eco-points, quest progress & streaks",
    },
    {
      title: "Event Management",
      href: "/faculty/events",
      iconName: "Calendar",
      badge: "Manage",
      badgeVariant: "secondary",
      description: "Create green events, track attendance & award points",
    },
    {
      title: "Reports Review",
      href: "/faculty/reports",
      iconName: "ClipboardList",
      badge: "Action Required",
      badgeVariant: "destructive",
      description: "Review, verify & grade student sustainability reports",
    },
  ],
  MAINTENANCE_STAFF: [
    {
      title: "Operations Center",
      href: "/maintenance/dashboard",
      iconName: "LayoutDashboard",
      description: "Dispatch status, active alerts, and telemetry",
    },
    {
      title: "Active Work Orders",
      href: "/maintenance/work-orders",
      iconName: "ClipboardList",
      badge: "5 Urgent",
      badgeVariant: "destructive",
      description: "Prioritized HVAC, plumbing, and electrical repairs",
    },
    {
      title: "Equipment & IoT Assets",
      href: "/maintenance/equipment",
      iconName: "Cpu",
      description: "Sensors, smart meters, and solar inverter status",
    },
    {
      title: "Leak & Anomaly Radar",
      href: "/maintenance/leak-alerts",
      iconName: "Droplets",
      badge: "Active",
      badgeVariant: "eco",
      description: "Acoustic water leak detection and power surges",
    },
    {
      title: "Preventive Schedule",
      href: "/maintenance/schedule",
      iconName: "CalendarClock",
      description: "Filter replacements and sensor calibrations",
    },
  ],
};

/**
 * Validates whether a user's role has permission to access a given URL path
 */
export function hasRoleAccess(role: Role, pathname: string): boolean {
  if (role === "ADMIN") return true; // Admins have universal campus access
  const config = ROLE_CONFIGS[role];
  if (!config) return false;

  return config.allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Returns default landing route for any role
 */
export function getRoleDefaultPath(role: Role): string {
  return ROLE_CONFIGS[role]?.defaultRoute || "/login";
}
