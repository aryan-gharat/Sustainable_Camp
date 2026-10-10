import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Trophy, Gift, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentEcoPointsPage() {
  const rewards = [
    { title: "Campus Dining $15 Eco-Voucher", points: 400, category: "Dining" },
    { title: "Priority EV Shuttle Pass", points: 300, category: "Transit" },
    { title: "University Bookstore Sustainable Merch", points: 500, category: "Campus" },
    { title: "Zero-Carbon Tree Planting Certificate", points: 250, category: "Impact" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-emerald-400" />
            Student Eco-Points & Rewards Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Redeem points earned through zero-waste actions and energy conservation
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-slate-300">Available Balance:</span>
          <span className="text-xl font-bold text-emerald-300">580 PTS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map((r) => (
          <Card key={r.title} className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">{r.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-400">{r.category}</CardDescription>
                </div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-xs font-bold border border-emerald-500/30">
                  {r.points} PTS
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="eco" size="sm" className="w-full text-xs">
                Redeem Reward
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
