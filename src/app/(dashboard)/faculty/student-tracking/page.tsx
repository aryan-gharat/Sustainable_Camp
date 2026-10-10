"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Users,
  Trophy,
  Flame,
  Award,
  Search,
  Sparkles,
  CheckCircle2,
  Send,
  UserCheck,
} from "lucide-react";

export default function FacultyStudentTrackingPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [awardPoints, setAwardPoints] = useState("50");
  const [awardReason, setAwardReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/faculty/student-tracking?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && data.students) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Fetch student tracking error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !awardPoints) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/faculty/student-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          points: awardPoints,
          reason: awardReason || "Faculty Academic Commendation",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message);
        setTimeout(() => setToastMessage(""), 3500);
        setSelectedStudent(null);
        setAwardReason("");
        fetchStudents();
      }
    } catch (err) {
      console.error("Award points error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="FACULTY" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Student Engagement & Gamification
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Student Participation & Quest Tracking
            <Users className="h-5 w-5 text-emerald-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor student sustainability streaks, quest completion rates, and award faculty commendations
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between glass-card p-4 rounded-xl border border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student name, email or student ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{students.length} Enrolled Students Tracked</span>
      </div>

      {/* Students Roster Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading student participation roster...</div>
      ) : students.length === 0 ? (
        <Card className="glass-card text-center p-8">
          <Users className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No Students Found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((stu) => (
            <Card key={stu.id} className="glass-card hover:border-emerald-500/40 transition">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md text-sm">
                      {stu.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-white">{stu.name}</CardTitle>
                      <p className="text-[11px] text-slate-400">{stu.department} • {stu.studentId}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Trophy className="h-3 w-3 inline mr-1" />
                    {stu.totalEcoPoints} PTS
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Streak</span>
                    <span className="font-extrabold text-amber-400">{stu.streakDays} Days</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">CO2 Saved</span>
                    <span className="font-extrabold text-emerald-400">{stu.carbonSavedKg} kg</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Quests Done</span>
                    <span className="font-extrabold text-blue-400">{stu.completedQuestsCount} Quests</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={() => setSelectedStudent(stu)}
                    variant="eco"
                    size="sm"
                    className="text-xs gap-1.5"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Award Faculty Commendation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Award Points Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-card border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Award Faculty Commendation
              </h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAwardPoints} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Student</span>
                <p className="text-sm font-bold text-white mt-0.5">{selectedStudent.name}</p>
                <p className="text-[11px] text-slate-400">{selectedStudent.department}</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eco-Points Amount</label>
                <select
                  value={awardPoints}
                  onChange={(e) => setAwardPoints(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="25">+25 Eco-Points (Minor Academic Action)</option>
                  <option value="50">+50 Eco-Points (Lab Sustainability Effort)</option>
                  <option value="100">+100 Eco-Points (Major Green Project)</option>
                  <option value="200">+200 Eco-Points (Excellence Award)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Commendation Reason / Notes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Outstanding zero-waste lab recycling initiative"
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setSelectedStudent(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="eco" disabled={submitting} className="text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? "Awarding..." : "Award Points"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
