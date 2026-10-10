"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Medal,
  Trophy,
  Flame,
  Building,
  GraduationCap,
  Sparkles,
  Search,
  UserCheck,
  TrendingUp,
  Award,
} from "lucide-react";

export default function StudentLeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"STUDENTS" | "DORMS" | "DEPARTMENTS">("STUDENTS");
  const [students, setStudents] = useState<any[]>([]);
  const [dorms, setDorms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/student/leaderboard");
        const data = await res.json();
        if (data.success) {
          setStudents(data.students || []);
          setDorms(data.dorms || []);
          setDepartments(data.departments || []);
          setCurrentUserRank(data.currentUserRank || null);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center gap-1 font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs shadow-md">
          <Trophy className="h-4 w-4 text-amber-400 fill-amber-400" /> #1 Champion
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center gap-1 font-bold text-slate-200 bg-slate-400/20 border border-slate-400/40 px-3 py-1 rounded-full text-xs">
          <Medal className="h-4 w-4 text-slate-300" /> #2 Silver
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-700/20 border border-amber-700/40 px-3 py-1 rounded-full text-xs">
          <Medal className="h-4 w-4 text-amber-500" /> #3 Bronze
        </span>
      );
    }
    return <span className="font-bold text-slate-400 text-sm px-2">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="STUDENT" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Campus Sustainability Arena
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Campus Green Leaderboards
            <Medal className="h-5 w-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare individual student eco-points, residence dorm energy reduction, and academic department rankings
          </p>
        </div>

        {currentUserRank && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-3 rounded-xl shadow-lg">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Your Standings</span>
              <div className="text-sm font-extrabold text-white">
                Rank #{currentUserRank.rank || 4} • <span className="text-emerald-400">{currentUserRank.totalEcoPoints || 580} PTS</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("STUDENTS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "STUDENTS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            Student Eco-Champions
          </button>
          <button
            onClick={() => setActiveTab("DORMS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "DORMS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            Dormitory Eco Cup
          </button>
          <button
            onClick={() => setActiveTab("DEPARTMENTS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "DEPARTMENTS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Department Challenge
          </button>
        </div>

        {activeTab === "STUDENTS" && (
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
        )}
      </div>

      {/* Main Leaderboard Tables */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading campus rankings...</div>
      ) : activeTab === "STUDENTS" ? (
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Student Eco-Pioneer</th>
                    <th className="py-3.5 px-4">Academic Department</th>
                    <th className="py-3.5 px-4 text-center">Active Streak</th>
                    <th className="py-3.5 px-4 text-right">CO2 Offset</th>
                    <th className="py-3.5 px-4 text-right">Eco-Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.map((stu) => {
                    const isCurrentUser = currentUserRank?.id === stu.id || stu.name === "Aiden Sharma";

                    return (
                      <tr
                        key={stu.id}
                        className={`transition ${
                          isCurrentUser
                            ? "bg-emerald-950/40 font-semibold text-white border-l-4 border-l-emerald-500"
                            : "hover:bg-slate-900/40"
                        }`}
                      >
                        <td className="py-3.5 px-4">{getRankBadge(stu.rank)}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md">
                              {stu.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{stu.name}</p>
                              {stu.badge && <p className="text-[10px] text-amber-300 font-semibold">{stu.badge}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{stu.department}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">
                            <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {stu.streakDays} Days
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">
                          {stu.carbonSavedKg} kg
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-black text-amber-400 text-sm">{stu.totalEcoPoints.toLocaleString()} PTS</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : activeTab === "DORMS" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dorms.map((dorm) => (
            <Card key={dorm.rank} className="glass-card hover:border-emerald-500/40 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getRankBadge(dorm.rank)}
                    <CardTitle className="text-base font-bold text-white">{dorm.dormName}</CardTitle>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{dorm.buildingCode}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Energy Baseline Drop</span>
                    <span className="text-base font-extrabold text-emerald-400">-{dorm.energyReductionPercent}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Recycled Waste</span>
                    <span className="text-base font-extrabold text-blue-400">{dorm.wasteRecycledKg} kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Active Dorm Residents: {dorm.residentCount}</span>
                  <span className="font-black text-amber-400 text-sm">{dorm.totalPoints.toLocaleString()} PTS</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Academic Departments Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <Card key={dept.rank} className="glass-card hover:border-emerald-500/40 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getRankBadge(dept.rank)}
                    <CardTitle className="text-sm font-bold text-white">{dept.deptName}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Carbon Offset</span>
                    <span className="text-base font-extrabold text-emerald-400">{dept.carbonSavedKg} kg</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Missions Verified</span>
                    <span className="text-base font-extrabold text-purple-400">{dept.activeQuestsDone} Quests</span>
                  </div>
                </div>

                <div className="flex items-center justify-end text-xs pt-2 border-t border-slate-800">
                  <span className="font-black text-amber-400 text-sm">{dept.totalPoints.toLocaleString()} PTS</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
