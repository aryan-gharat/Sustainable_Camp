import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coins, Plus, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FacultyGrantsPage() {
  const grants = [
    {
      title: "Campus Smart Microgrid Peak Shifting",
      agency: "US Department of Energy (DOE)",
      amount: "$250,000",
      status: "Active (Year 2 of 3)",
      milestone: "Battery inverter algorithm benchmark passed",
    },
    {
      title: "Acoustic AI Leak Detection in District Steam",
      agency: "National Science Foundation (NSF)",
      amount: "$170,000",
      status: "Active (Year 1 of 2)",
      milestone: "Hardware prototype deployed in 3 utility tunnels",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Coins className="h-6 w-6 text-emerald-400" />
            Sustainability Research Grants & Funding Portal
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active and proposed university grant portfolios funded by federal and institutional foundations
          </p>
        </div>

        <Button variant="eco" size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Submit Grant Proposal
        </Button>
      </div>

      <div className="space-y-4">
        {grants.map((g) => (
          <Card key={g.title} className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold text-white">{g.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-400">{g.agency}</CardDescription>
                </div>
                <span className="text-lg font-bold text-emerald-400 font-mono">{g.amount}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-3 rounded bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Milestone: {g.milestone}</span>
                <span className="rounded bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[11px] font-medium border border-emerald-500/30">
                  {g.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
