import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Award, Users } from "lucide-react";

export default function StudentChallengesPage() {
  const quests = [
    {
      title: "Campus Zero-Waste Dining Week",
      desc: "Divert all single-use plastics and log your compostable dining waste at smart bins.",
      reward: "+120 PTS",
      deadline: "Ends in 3 days",
      participants: "420 students enrolled",
      status: "In Progress (4/5)",
    },
    {
      title: "Dorm Energy Blackout Hour",
      desc: "Power down non-essential lighting and desktop monitors between 8 PM - 9 PM on Thursdays.",
      reward: "+75 PTS",
      deadline: "Thursday 20:00",
      participants: "890 students enrolled",
      status: "Upcoming",
    },
    {
      title: "Sustainable Transit 5-Day Streak",
      desc: "Walk, bike, or use the campus zero-emission shuttle 5 consecutive school days.",
      reward: "+150 PTS",
      deadline: "Continuous",
      participants: "630 students enrolled",
      status: "Available to Join",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-400" />
            Active Green Quests & Missions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Participate in campus-wide sustainability challenges and verified peer competitions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {quests.map((q) => (
          <Card key={q.title} className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold text-white">{q.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-300 mt-1">{q.desc}</CardDescription>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-3 py-1 text-xs font-bold border border-emerald-500/30">
                  {q.reward}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {q.deadline}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {q.participants}
                  </span>
                </div>
                <Button variant="eco" size="sm" className="text-xs h-8">
                  {q.status}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
