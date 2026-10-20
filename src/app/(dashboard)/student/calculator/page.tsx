"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Calculator,
  Leaf,
  Bike,
  Utensils,
  Zap,
  Trash2,
  TrendingDown,
  ArrowRight,
  History,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

export default function StudentCalculatorPage() {
  const [commuteMode, setCommuteMode] = useState("BICYCLE");
  const [commuteKm, setCommuteKm] = useState(25);
  const [dietType, setDietType] = useState("VEGETARIAN");
  const [dormHours, setDormHours] = useState(6);
  const [recyclingRate, setRecyclingRate] = useState(80);

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/student/calculator");
      const data = await res.json();
      if (data.success && data.history) {
        setHistory(data.history);
        if (data.history.length > 0 && !result) {
          setResult(data.history[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch calculation history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCalculating(true);
      const res = await fetch("/api/student/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commuteMode,
          commuteKmPerWeek: commuteKm,
          dietType,
          dormElectricityHours: dormHours,
          recyclingRate,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        setToastMessage("🎉 Carbon calculation complete! +40 Eco-Points logged to profile.");
        setTimeout(() => setToastMessage(""), 4000);
        fetchHistory();
      }
    } catch (err) {
      console.error("Calculation error:", err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="STUDENT" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              GHG Analytics Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Personal Carbon Footprint Calculator
            <Calculator className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit your transport, diet, dorm electricity & waste footprint to receive AI decarbonization guidance
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Interactive Form */}
        <Card className="lg:col-span-7 glass-card">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-400" />
              Annual Student Footprint Quiz
            </CardTitle>
            <CardDescription>
              Adjust sliders and selectors to model your yearly environmental impact
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleCalculate} className="space-y-5 text-xs">
              {/* 1. Commute Mode */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-200 flex items-center gap-2">
                  <Bike className="h-4 w-4 text-emerald-400" />
                  1. Primary Campus Commute Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "BICYCLE", label: "Bicycle / Scooter", icon: "🚲" },
                    { id: "WALKING", label: "Walking", icon: "🚶" },
                    { id: "CAMPUS_SHUTTLE", label: "EV Campus Shuttle", icon: "🚌" },
                    { id: "PUBLIC_TRANSIT", label: "Metro / Bus", icon: "🚆" },
                    { id: "CARPOOL", label: "Carpool", icon: "🚗" },
                    { id: "SOLO_CAR", label: "Solo Gasoline Car", icon: "🚘" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCommuteMode(item.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                        commuteMode === item.id
                          ? "bg-emerald-500/20 border-emerald-500/50 text-white font-bold"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Commute Distance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-200">2. Weekly Commute Distance (km)</label>
                  <span className="text-emerald-400 font-bold text-sm">{commuteKm} km / week</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={commuteKm}
                  onChange={(e) => setCommuteKm(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* 3. Diet Type */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-200 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-amber-400" />
                  3. Dietary Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "VEGAN", label: "Plant-Based (Vegan)" },
                    { id: "VEGETARIAN", label: "Vegetarian" },
                    { id: "PESCATARIAN", label: "Pescatarian" },
                    { id: "BALANCED", label: "Balanced Flexitarian" },
                    { id: "HIGH_MEAT", label: "High Meat Intake" },
                  ].map((d) => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setDietType(d.id)}
                      className={`p-2.5 rounded-xl border text-center transition text-[11px] ${
                        dietType === d.id
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Dorm Hours */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-200 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    4. Active Dorm High-Power Electronics (hrs/day)
                  </label>
                  <span className="text-blue-400 font-bold text-sm">{dormHours} hrs / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={dormHours}
                  onChange={(e) => setDormHours(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* 5. Recycling Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-200 flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-purple-400" />
                    5. Waste Sorting & Recycling Rate (%)
                  </label>
                  <span className="text-purple-400 font-bold text-sm">{recyclingRate}% Recycled</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recyclingRate}
                  onChange={(e) => setRecyclingRate(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <Button
                type="submit"
                variant="eco"
                disabled={calculating}
                className="w-full text-xs font-semibold gap-2 py-2.5"
              >
                <Calculator className="h-4 w-4" />
                {calculating ? "Calculating Carbon Emissions..." : "Calculate & Save Audit (+40 PTS)"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results & AI Recommendation Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {result && (
            <Card className="glass-card border-emerald-500/40 bg-gradient-to-b from-slate-950 to-emerald-950/30">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    Your Annual Carbon Results
                  </CardTitle>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Score
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Big Metric Display */}
                <div className="text-center p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-semibold">Total Estimated GHG Footprint</span>
                  <div className="text-3xl font-black text-white mt-1">
                    {result.totalAnnualKgCo2} <span className="text-sm text-emerald-400 font-bold">kg CO2e / yr</span>
                  </div>
                  <p className="text-[11px] text-emerald-300 font-semibold mt-1 flex items-center justify-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5" />
                    43% Below National Student Average (3,200 kg)
                  </p>
                </div>

                {/* Sector Breakdown */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Category Emission Breakdown:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Transport</span>
                      <span className="font-bold text-emerald-400">{result.transportKg} kg</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Diet</span>
                      <span className="font-bold text-amber-400">{result.dietKg} kg</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Dorm Energy</span>
                      <span className="font-bold text-blue-400">{result.energyKg} kg</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Landfill Waste</span>
                      <span className="font-bold text-purple-400">{result.wasteKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* AI Sustainability Advisor Card */}
                {result.aiTip && (
                  <div className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <Leaf className="h-4 w-4" />
                      Recommended Action:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{result.aiTip}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Audit History Card */}
          <Card className="glass-card">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-xs font-bold text-white flex items-center gap-2">
                <History className="h-4 w-4 text-slate-400" />
                Previous Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2">
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No previous calculations recorded.</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{item.totalAnnualKgCo2} kg CO2e</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {item.commuteMode.replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
