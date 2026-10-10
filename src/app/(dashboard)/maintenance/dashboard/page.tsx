"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Wrench,
  ClipboardList,
  Droplets,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function MaintenanceDashboardPage() {
  const [data, setData] = useState<any>({
    engineer: {
      name: "Carlos Mendez",
      activeWorkOrdersCount: 5,
      inProgressCount: 2,
      resolvedTodayCount: 4,
      totalCarbonPreventedKg: 680.0,
      activeLeakAlertsCount: 1,
    },
    urgentWorkOrdersPreview: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/maintenance/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Maintenance dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const eng = data.engineer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="MAINTENANCE_STAFF" size="sm" />
            <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              Campus Facilities & Smart HVAC Operations
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Maintenance Operations Center
            <Wrench className="h-6 w-6 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Execute work order repairs, resolve acoustic water leaks & notify reporting students upon completion
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/maintenance/work-orders">
            <Button variant="eco" size="sm" className="gap-1.5 text-xs shadow-lg shadow-emerald-600/20">
              <ClipboardList className="h-3.5 w-3.5" />
              Active Work Orders ({eng.activeWorkOrdersCount})
            </Button>
          </Link>
          <Link href="/maintenance/leak-alerts">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-950/40">
              <Droplets className="h-3.5 w-3.5 text-amber-400" />
              Leak Radar ({eng.activeLeakAlertsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Work Orders"
          value={eng.activeWorkOrdersCount.toString()}
          unit="Orders"
          change={`${eng.inProgressCount} In-Progress`}
          changeType="positive"
          iconName="clipboardList"
          category="energy"
          description="Assigned engineering dispatch"
        />
        <MetricCard
          title="Issues Resolved"
          value={eng.resolvedTodayCount.toString()}
          unit="Completed"
          change="Students Notified"
          changeType="positive"
          iconName="trophy"
          category="points"
          description="Verified eco repairs"
        />
        <MetricCard
          title="Carbon Loss Prevented"
          value={eng.totalCarbonPreventedKg.toString()}
          unit="kg CO2"
          change="Smart Leak Sealing"
          changeType="positive"
          iconName="leaf"
          category="waste"
          description="Chiller & HVAC efficiency"
        />
        <MetricCard
          title="Acoustic Leak Radar"
          value={eng.activeLeakAlertsCount.toString()}
          unit="Active Alert"
          change="High Priority"
          changeType="positive"
          iconName="droplets"
          category="water"
          description="Sub-basement chiller loop"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/maintenance/work-orders" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Active Work Orders</h4>
                <p className="text-[11px] text-slate-400">Update Repair Status</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/maintenance/equipment" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">Equipment & Smart Meters</h4>
                <p className="text-[11px] text-slate-400">IoT Inverters & Chillers</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/maintenance/leak-alerts" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-300">Leak Radar</h4>
                <p className="text-[11px] text-slate-400">Acoustic Water Loss</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/maintenance/schedule" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Preventive Schedule</h4>
                <p className="text-[11px] text-slate-400">Filter Calibrations</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Main Work Order Queue */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-amber-400" />
              Assigned Work Order Dispatch Queue
            </CardTitle>
            <CardDescription>
              Prioritized repairs originated from student hazard reports & AI anomaly alerts
            </CardDescription>
          </div>
          <Link href="/maintenance/work-orders">
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-amber-400 hover:text-amber-300">
              Manage Work Orders <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {(data.urgentWorkOrdersPreview || []).map((wo: any) => (
            <div key={wo.id} className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{wo.workOrderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {wo.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{wo.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Location: <span className="text-white font-semibold">{wo.locationDetails}</span> ({wo.buildingName})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reported by: {wo.reportedBy}</p>
                </div>

                <Link href="/maintenance/work-orders">
                  <Button variant="eco" size="sm" className="text-xs gap-1.5 shadow-md shadow-emerald-600/20">
                    <Wrench className="h-3.5 w-3.5" /> Start / Resolve Repair
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
