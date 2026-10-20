"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Building2,
  GraduationCap,
  BarChart3,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Zap,
  Leaf,
  Activity,
  PlusCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>({
    stats: {
      totalUsers: 48,
      totalBuildings: 12,
      totalDepartments: 8,
      totalCarbonSavedTonnes: 142.8,
      pendingReportApprovals: 5,
      activeIoTMeters: 34,
      systemHealth: "OPTIMAL_100%",
    },
    recentSystemLogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminDashboard();
  }, []);

  const stats = data.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="ADMIN" size="sm" />
            <span className="text-[11px] text-slate-300 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Campus Executive Governance
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Institutional Sustainability Operations
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage users & RBAC, department energy budgets, facility infrastructure & report approvals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/users">
            <Button variant="eco" size="sm" className="gap-1.5 text-xs shadow-lg shadow-emerald-600/20">
              <Users className="h-3.5 w-3.5" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-purple-500/30 text-purple-300 hover:bg-purple-950/40">
              <FileCheck className="h-3.5 w-3.5 text-purple-400" />
              Approval Queue ({stats.pendingReportApprovals})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Campus Registered Users"
          value={stats.totalUsers.toString()}
          unit="Users"
          change="RBAC Guarded"
          changeType="positive"
          iconName="users"
          category="points"
          description="Students, Faculty & Staff"
        />
        <MetricCard
          title="Smart Facilities"
          value={stats.totalBuildings.toString()}
          unit="Buildings"
          change={`${stats.activeIoTMeters} IoT Meters`}
          changeType="positive"
          iconName="leaf"
          category="waste"
          description="LEED Certified Facilities"
        />
        <MetricCard
          title="Report Approval Queue"
          value={stats.pendingReportApprovals.toString()}
          unit="Pending"
          change="Governance Queue"
          changeType="positive"
          iconName="clipboardList"
          category="ai"
          description="Eco hazard audits"
        />
        <MetricCard
          title="Annual Carbon Offset"
          value={stats.totalCarbonSavedTonnes.toString()}
          unit="Tonnes"
          change="-24.8% Baseline"
          changeType="positive"
          iconName="leaf"
          category="energy"
          description="Net-Zero Target 2030"
        />
      </div>

      {/* Main Admin Features Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/users" className="group">
          <Card className="glass-card h-full hover:border-purple-500/40 transition">
            <CardHeader className="pb-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-2 group-hover:scale-110 transition">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                User Management & RBAC
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
              </CardTitle>
              <CardDescription>
                Govern student, faculty, maintenance staff access roles, create accounts & edit permissions.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/departments" className="group">
          <Card className="glass-card h-full hover:border-emerald-500/40 transition">
            <CardHeader className="pb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-2 group-hover:scale-110 transition">
                <GraduationCap className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-bold text-white group-hover:text-emerald-300 flex items-center justify-between">
                Department Management
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
              </CardTitle>
              <CardDescription>
                Set department energy caps, monitor ESG ratings, carbon limits & student rosters.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/buildings" className="group">
          <Card className="glass-card h-full hover:border-blue-500/40 transition">
            <CardHeader className="pb-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-2 group-hover:scale-110 transition">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-bold text-white group-hover:text-blue-300 flex items-center justify-between">
                Building Infrastructure
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
              </CardTitle>
              <CardDescription>
                Register campus buildings, floor area, LEED ratings, solar PV panels & smart utility meters.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/analytics" className="group">
          <Card className="glass-card h-full hover:border-teal-500/40 transition">
            <CardHeader className="pb-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-2 group-hover:scale-110 transition">
                <BarChart3 className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                Campus Sustainability Analytics
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition" />
              </CardTitle>
              <CardDescription>
                Executive level telemetry for power draw, rooftop solar PV, water usage & GHG carbon.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/reports" className="group sm:col-span-2 lg:col-span-2">
          <Card className="glass-card h-full border-amber-500/30 hover:border-amber-500/50 transition">
            <CardHeader className="pb-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-2 group-hover:scale-110 transition">
                <FileCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-base font-bold text-white group-hover:text-amber-300 flex items-center justify-between">
                Report Approval & Work Order Dispatch Workflow
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </CardTitle>
              <CardDescription>
                Master executive approval hub to review student eco-audits, verify water/energy leaks, allocate eco-points, and automatically dispatch work orders to maintenance engineers.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* System Governance Logs */}
      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" />
            System Governance & Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-2.5 text-xs">
          {(data.recentSystemLogs || []).map((log: any) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">{log.action}: </span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">{log.user}</span>
                <span className="text-[10px] text-purple-400 font-semibold">{log.time}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
