import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarClock, Plus, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenanceSchedulePage() {
  const schedule = [
    { title: "Quarterly MERV-13 Air Filter Replacement", target: "Verdant Quad (AHU 1-4)", due: "Tomorrow", tech: "Carlos Mendez" },
    { title: "Solar Array Inverter Thermal Imaging Scan", target: "Science Complex Rooftop", due: "In 3 Days", tech: "Alex Rivera" },
    { title: "Rainwater Cistern Backwash & UV Lamp Inspection", target: "EcoLiving Dorm Cluster", due: "Friday", tech: "Carlos Mendez" },
    { title: "Smart Electrical Sub-meter Calibration Check", target: "Central Library Switchgear", due: "Next Monday", tech: "Unassigned" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-emerald-400" />
            Preventative Maintenance Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Routine equipment servicing to maximize energy efficiency and equipment lifespan
          </p>
        </div>

        <Button variant="eco" size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Schedule Preventative Service
        </Button>
      </div>

      <div className="space-y-3">
        {schedule.map((s) => (
          <Card key={s.title} className="glass-card">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h4 className="font-semibold text-white text-sm">{s.title}</h4>
                <p className="text-slate-400 mt-0.5">
                  Target: {s.target} • Assigned: <span className="text-slate-200">{s.tech}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px]">
                  <Clock className="h-3 w-3" />
                  {s.due}
                </span>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  Log Completion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
