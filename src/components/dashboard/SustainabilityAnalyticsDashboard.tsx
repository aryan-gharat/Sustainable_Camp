"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Droplets,
  Recycle,
  Leaf,
  Trophy,
  Loader2,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Award,
} from "lucide-react";

export function SustainabilityAnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics/sustainability");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Fetch analytics error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
        <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
        <span>Loading operational telemetry data...</span>
      </div>
    );
  }

  const metrics = data?.metrics || {
    campusSustainabilityScore: { score: 94, maxScore: 100, rating: "LEED Platinum Index", improvement: "+4.5 pts" },
    energyConsumption: { currentDrawKw: 184.2, solarGenerationKw: 420.0, cleanEnergyRatio: 68.4, change: "-14.2% vs baseline" },
    waterUsage: { totalConservedLiters: 125000, currentFlowLitersPerHr: 340, rainwaterSharePercent: 42.0, change: "-18.5% utility draw" },
    wasteManagement: { diversionRatePercent: 86.2, recycledKgWeekly: 640.0, compostedKgWeekly: 480.0, change: "+12.4% recycled" },
    carbonFootprint: { annualEmissionsTonnes: 142.8, treeEquivalent: 7140, targetTonnes: 180.0, change: "-24.8% net reduction" },
  };

  const charts = data?.chartsData || {
    hourlyEnergy: [],
    monthlyWater: [],
    wasteBreakdown: [],
    carbonTrajectory: [],
    scoreComponents: [],
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Campus Sustainability Score */}
        <div className="glass-card p-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-slate-950 to-amber-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Campus ESG Score</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Trophy className="h-4 w-4" /></div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {metrics.campusSustainabilityScore.score} <span className="text-xs text-amber-400 font-bold">/ 100</span>
          </div>
          <p className="text-[11px] text-amber-300 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {metrics.campusSustainabilityScore.improvement} ({metrics.campusSustainabilityScore.rating})
          </p>
        </div>

        {/* Energy Consumption */}
        <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-950 to-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Energy Consumption</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Zap className="h-4 w-4" /></div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.energyConsumption.currentDrawKw} <span className="text-xs text-amber-400 font-bold">kW</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingDown className="h-3 w-3" /> {metrics.energyConsumption.change}
          </p>
        </div>

        {/* Water Usage */}
        <div className="glass-card p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-950 to-cyan-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Water Usage</span>
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><Droplets className="h-4 w-4" /></div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.waterUsage.currentFlowLitersPerHr} <span className="text-xs text-cyan-400 font-bold">L/hr</span>
          </div>
          <p className="text-[11px] text-cyan-300 font-semibold mt-1">
            {metrics.waterUsage.rainwaterSharePercent}% Rainwater Share
          </p>
        </div>

        {/* Waste Management */}
        <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 to-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Waste Diversion</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><Recycle className="h-4 w-4" /></div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.wasteManagement.diversionRatePercent}%
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">
            {metrics.wasteManagement.change}
          </p>
        </div>

        {/* Carbon Footprint */}
        <div className="glass-card p-4 rounded-xl border border-purple-500/30 bg-gradient-to-br from-slate-950 to-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Carbon Footprint</span>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><Leaf className="h-4 w-4" /></div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {metrics.carbonFootprint.annualEmissionsTonnes} <span className="text-xs text-purple-400 font-bold">Tonnes</span>
          </div>
          <p className="text-[11px] text-purple-300 font-semibold mt-1">
            {metrics.carbonFootprint.change}
          </p>
        </div>
      </div>

      {/* 2. Interactive Charts Section 1: Energy & Carbon Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ⚡ Recharts AreaChart: 24h Hourly Energy Demand vs Solar PV Generation */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  Energy Demand vs Solar PV Generation (24h)
                </CardTitle>
                <CardDescription>
                  Live load curve balancing grid draw and rooftop photovoltaic solar generation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.hourlyEnergy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Area type="monotone" dataKey="solarKw" name="Solar PV Output (kW)" stroke="#10b981" fillOpacity={1} fill="url(#solarGrad)" />
                  <Area type="monotone" dataKey="gridKw" name="Utility Grid Draw (kW)" stroke="#3b82f6" fillOpacity={1} fill="url(#gridGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 🌿 Recharts LineChart: Carbon Footprint Decarbonization Trajectory */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Leaf className="h-4 w-4 text-purple-400" />
                GHG Decarbonization Trajectory to 2030 Net-Zero
              </CardTitle>
              <CardDescription>
                Historical emissions reduction vs institutional climate action targets
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.carbonTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Line type="monotone" dataKey="emissions" name="Actual CO2e (Tonnes)" stroke="#a855f7" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="target" name="Net-Zero Target Line" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Interactive Charts Section 2: Water BarChart, Waste PieChart & Score RadarChart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 💧 Recharts BarChart: Monthly Water Usage & Rainwater Catchment */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-400" />
              Utility Water vs Rainwater (m³)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyWater} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="utilityWater" name="Utility Water (m³)" fill="#0284c7" stackId="a" />
                  <Bar dataKey="rainwater" name="Harvested Rainwater" fill="#06b6d4" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ♻️ Recharts PieChart: Waste Management Category Breakdown */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Recycle className="h-4 w-4 text-emerald-400" />
              Waste Diversion Categories (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.wasteBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {charts.wasteBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 🏆 Recharts RadarChart: Campus Sustainability ESG Score Components */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              ESG Score Components vs Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={charts.scoreComponents}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Campus Score" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                  <Radar name="Peer Benchmark" dataKey="benchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
