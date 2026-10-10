"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Trophy,
  Flame,
  Medal,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Leaf,
  Calendar,
  Gift,
  Calculator,
  FileText,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function StudentDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalEcoPoints: 580,
    carbonSavedKg: 122.4,
    waterSavedLiters: 1400.0,
    streakDays: 19,
    campusRank: 4,
    activeQuestsCount: 3,
    verifiedReportsCount: 2,
    upcomingEventsCount: 4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/student/dashboard");
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="STUDENT" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Tier 4 Campus Green Pioneer
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Student Eco-Action Hub
            <Sparkles className="h-5 w-5 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your verified carbon offset, active campus quests, and redeem sustainable rewards
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/student/calculator">
            <Button variant="eco" size="sm" className="gap-1.5 text-xs shadow-lg shadow-emerald-600/20">
              <Calculator className="h-3.5 w-3.5" />
              Carbon Calculator
            </Button>
          </Link>
          <Link href="/student/reports">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-950/40">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              Submit Eco Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Earned Eco-Points"
          value={stats.totalEcoPoints.toString()}
          unit="PTS"
          change="+120 pts"
          changeType="positive"
          iconName="trophy"
          category="points"
          description={`Campus Rank #${stats.campusRank}`}
        />
        <MetricCard
          title="Personal CO2 Offset"
          value={stats.carbonSavedKg.toFixed(1)}
          unit="kg"
          change="+14.2 kg"
          changeType="positive"
          iconName="leaf"
          category="waste"
          description="Equal to 6 mature trees"
        />
        <MetricCard
          title="Water Conserved"
          value={stats.waterSavedLiters.toLocaleString()}
          unit="Liters"
          change="+250 L"
          changeType="positive"
          iconName="droplets"
          category="water"
          description="Low-flow dorm habits"
        />
        <MetricCard
          title="Sustainable Streak"
          value={stats.streakDays.toString()}
          unit="Days"
          change="Personal Best!"
          changeType="positive"
          iconName="sparkles"
          category="points"
          description="Active daily green actions"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/student/reports" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">Sustainability Reports</h4>
                <p className="text-[11px] text-slate-400">{stats.verifiedReportsCount} Verified Reports</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/student/events" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-300">Campus Events</h4>
                <p className="text-[11px] text-slate-400">{stats.upcomingEventsCount} Upcoming Drives</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/student/rewards" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Eco Rewards</h4>
                <p className="text-[11px] text-slate-400">Redeem Vouchers</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link href="/student/leaderboard" className="group">
          <div className="glass-card p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/60 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
                <Medal className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300">Campus Leaderboard</h4>
                <p className="text-[11px] text-slate-400">Dorm Standings</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Missions & Active Quests */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Flame className="h-4 w-4 text-emerald-400" />
                Featured Sustainability Quests
              </CardTitle>
              <CardDescription>
                Complete active missions to earn Eco-Points and reduce campus GHG emissions
              </CardDescription>
            </div>
            <Link href="/student/events">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-emerald-400 hover:text-emerald-300">
                Browse Events <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Active Mission</span>
                  <h4 className="font-semibold text-white text-sm mt-0.5">Campus Zero-Waste Dining Challenge</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Log 5 compost weigh-ins at the Student Union dining hall smart bins to eliminate food landfill waste.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                  +120 PTS
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[80%]" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>4 / 5 Bin Weigh-Ins Logged</span>
                <span className="text-emerald-400 font-bold">80% Completed</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">Weekly Challenge</span>
                  <h4 className="font-semibold text-white text-sm mt-0.5">Zero-Emission Commute Streak</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Commute to lectures via bicycle, walking, or campus electric shuttle 5 consecutive school days.
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-3 py-1 text-xs font-bold text-blue-300">
                  +150 PTS
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[60%]" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>3 / 5 Days Verified</span>
                <span className="text-blue-400 font-bold">60% Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dormitory Standings Sidebar */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
              <Medal className="h-4 w-4 text-amber-400" />
              Dormitory Eco Cup
            </CardTitle>
            <CardDescription>
              Live residence hall reduction standings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 shadow-md">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-amber-400 text-sm bg-amber-500/20 px-2 py-0.5 rounded">#1</span>
                  <div>
                    <p className="font-bold text-white">EcoLiving Dorm Cluster</p>
                    <p className="text-[10px] text-amber-300/80">-24.5% Energy Baseline</p>
                  </div>
                </div>
                <span className="font-extrabold text-amber-300 text-xs">4,820 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-400 text-sm bg-slate-800 px-2 py-0.5 rounded">#2</span>
                  <div>
                    <p className="font-semibold text-slate-200">North Quad Residence</p>
                    <p className="text-[10px] text-slate-400">-19.2% Energy Baseline</p>
                  </div>
                </div>
                <span className="font-bold text-slate-300 text-xs">4,190 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-400 text-sm bg-slate-800 px-2 py-0.5 rounded">#3</span>
                  <div>
                    <p className="font-semibold text-slate-200">Highland Tower Hall</p>
                    <p className="text-[10px] text-slate-400">-16.8% Energy Baseline</p>
                  </div>
                </div>
                <span className="font-bold text-slate-300 text-xs">3,750 pts</span>
              </div>
            </div>

            <div className="pt-3">
              <Link href="/student/leaderboard">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1">
                  Full Campus Rankings
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
