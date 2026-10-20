"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Zap,
  BarChart3,
  Users,
  Calendar,
  ClipboardList,
  ArrowRight,
  School,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  TrendingDown,
} from "lucide-react";

export default function FacultyDashboardPage() {
  const [data, setData] = useState<any>({
    department: {
      name: "Dept of Renewable Energy & Smart Grid Systems",
      energyDrawKw: 28.4,
      energyDrawChange: "-14.2%",
      totalStudentsTracked: 142,
      pendingReportsCount: 3,
      activeEventsCount: 4,
      totalCarbonOffsetKg: 1850.0,
      departmentRank: 1,
      labEnergyRating: "A- (LEED Platinum Index)",
      activeSensorsPercent: 98.2,
    },
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/faculty/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Faculty dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const dept = data.department;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="FACULTY" size="sm" />
            <span className="text-[11px] text-slate-300 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {dept.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Faculty Operations Console
            <School className="h-5 w-5 text-sky-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Departmental telemetry, student eco-participation tracking, campus events & report approvals
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/faculty/events">
            <Button variant="eco" size="sm" className="gap-1.5 text-xs shadow-lg shadow-emerald-600/20">
              <Calendar className="h-3.5 w-3.5" />
              Create Event
            </Button>
          </Link>
          <Link href="/faculty/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-950/40">
              <ClipboardList className="h-3.5 w-3.5 text-amber-400" />
              Review Reports ({dept.pendingReportsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Dept Power Draw"
          value={dept.energyDrawKw.toString()}
          unit="kW"
          change={dept.energyDrawChange}
          changeType="positive"
          iconName="zap"
          category="energy"
          description="vs last semester"
        />
        <MetricCard
          title="Students Tracked"
          value={dept.totalStudentsTracked.toString()}
          unit="Active"
          change="100% Sync"
          changeType="positive"
          iconName="users"
          category="points"
          description="Gamified eco participation"
        />
        <MetricCard
          title="Pending Reports"
          value={dept.pendingReportsCount.toString()}
          unit="Audits"
          change="Action Required"
          changeType="positive"
          iconName="clipboardList"
          category="ai"
          description="Awaiting faculty review"
        />
        <MetricCard
          title="Dept Carbon Offset"
          value={dept.totalCarbonOffsetKg.toLocaleString()}
          unit="kg CO2"
          change="Rank #1 Dept"
          changeType="positive"
          iconName="leaf"
          category="waste"
          description={dept.labEnergyRating}
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/faculty/analytics" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-300">Department Analytics</h4>
                <p className="text-[11px] text-slate-400">Lab Power & Water Telemetry</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/faculty/student-tracking" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">Student Participation</h4>
                <p className="text-[11px] text-slate-400">Roster Eco-Points & Streaks</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/faculty/events" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Event Management</h4>
                <p className="text-[11px] text-slate-400">Publish Green Drives</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/faculty/reports" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Reports Review</h4>
                <p className="text-[11px] text-slate-400">Verify Hazard Audits</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Student Reports Preview */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-amber-400" />
                Pending Sustainability Reports Review
              </CardTitle>
              <CardDescription>
                Student eco audits requiring faculty verification and point allocation
              </CardDescription>
            </div>
            <Link href="/faculty/reports">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-amber-400 hover:text-amber-300">
                Review All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">Water Leak Audit</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">Chilled Water Pipe Micro-Leak in Science Complex</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Submitted by <span className="font-semibold text-emerald-400">Aiden Sharma</span> • 5 L/min loss estimated.
                  </p>
                </div>
                <Link href="/faculty/reports">
                  <Button variant="eco" size="sm" className="text-xs gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verify & Grade
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400">Energy Waste Audit</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">Unnecessary Overnight Hallway Lighting Surge</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Submitted by <span className="font-semibold text-blue-400">Maya Lin</span> • Verdant Quad 3rd Floor.
                  </p>
                </div>
                <Link href="/faculty/reports">
                  <Button variant="outline" size="sm" className="text-xs">
                    Review
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Lab Telemetry Preview */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              Department Lab Telemetry
            </CardTitle>
            <CardDescription>
              Smart sensor load across active academic labs
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>Solar & Smart Grid Lab</span>
                <span className="text-emerald-400">14.2 kW</span>
              </div>
              <p className="text-[11px] text-slate-400">Occupancy: 28 Students • HVAC: 22°C Eco</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>Microgrid Innovation Lab</span>
                <span className="text-blue-400">8.6 kW</span>
              </div>
              <p className="text-[11px] text-slate-400">Occupancy: 18 Students • Solar PV Active</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>High-Performance AI Cluster</span>
                <span className="text-purple-400">24.8 kW</span>
              </div>
              <p className="text-[11px] text-slate-400">Occupancy: 4 Engineers • Chilled Liquid</p>
            </div>

            <div className="pt-2">
              <Link href="/faculty/analytics">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1">
                  View Full Analytics
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
