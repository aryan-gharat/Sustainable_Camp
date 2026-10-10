import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Clock, Users, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FacultyClassroomEnergyPage() {
  const rooms = [
    { room: "Auditorium A-101", occupancy: "142 / 160", temp: "22°C", hvac: "Active Eco", light: "80% Dimmed" },
    { room: "Lecture Hall B-105", occupancy: "0 / 80", temp: "19°C", hvac: "Sleep Mode", light: "Off" },
    { room: "Seminar Suite C-302", occupancy: "18 / 25", temp: "21.5°C", hvac: "Active Eco", light: "60% Ambient" },
    { room: "Computer Lab D-210", occupancy: "32 / 35", temp: "21°C", hvac: "Max Cooling", light: "100%" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-400" />
          Smart Classroom Energy & Lighting Automation
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Dynamic HVAC setback and smart illumination synchronized with university timetable data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((r) => (
          <Card key={r.room} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-semibold text-white">{r.room}</CardTitle>
                  <CardDescription className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Users className="h-3.5 w-3.5" /> Occupancy: {r.occupancy}
                  </CardDescription>
                </div>
                <span className="rounded bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 font-medium border border-emerald-500/30">
                  {r.hvac}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between border-t border-slate-800 pt-2 text-slate-300">
                <span>Current Temp: {r.temp}</span>
                <span>Lighting Level: {r.light}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
