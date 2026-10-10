"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  Gift,
  Trophy,
  Coffee,
  BookOpen,
  Bike,
  TreePine,
  Sparkles,
  CheckCircle2,
  Copy,
  Clock,
  Filter,
  Tag,
  ShoppingBag,
} from "lucide-react";

export default function StudentRewardsPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState(580);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"CATALOG" | "MY_VOUCHERS">("CATALOG");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filterCategory !== "ALL") queryParams.append("category", filterCategory);

      const res = await fetch(`/api/student/rewards?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRewards(data.rewards || []);
        setRedemptions(data.redemptions || []);
        setUserPoints(data.userPoints ?? 580);
      }
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [filterCategory]);

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if (userPoints < pointsCost) {
      setToastMessage(`Insufficient points! You need ${pointsCost} PTS to redeem this reward.`);
      setTimeout(() => setToastMessage(""), 3500);
      return;
    }

    try {
      setProcessingId(rewardId);
      const res = await fetch("/api/student/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage("🎉 Reward redeemed successfully! Check 'My Active Vouchers' tab.");
        setTimeout(() => setToastMessage(""), 4000);
        fetchRewards();
        setActiveTab("MY_VOUCHERS");
      } else {
        setToastMessage(data.error || "Failed to redeem reward.");
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch (err) {
      console.error("Reward redeem error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getRewardIcon = (category: string) => {
    switch (category) {
      case "DINING":
        return <Coffee className="h-5 w-5 text-amber-400" />;
      case "VOUCHER":
        return <BookOpen className="h-5 w-5 text-blue-400" />;
      case "COMMUTE":
        return <Bike className="h-5 w-5 text-emerald-400" />;
      case "DONATION":
        return <TreePine className="h-5 w-5 text-teal-400" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role="STUDENT" size="sm" />
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Green Marketplace
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Eco Rewards & Vouchers
            <Gift className="h-5 w-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Redeem your earned Eco-Points for organic campus cafe discounts, bookstore vouchers & bike passes
          </p>
        </div>

        {/* User Eco-Points Card */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 p-3.5 rounded-xl shadow-lg">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Available Balance</span>
            <div className="text-xl font-black text-white">{userPoints.toLocaleString()} <span className="text-xs text-emerald-400 font-bold">PTS</span></div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold text-center animate-fade-in shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Tabs & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("CATALOG")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "CATALOG"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Gift className="h-3.5 w-3.5" />
            Reward Catalog ({rewards.length})
          </button>
          <button
            onClick={() => setActiveTab("MY_VOUCHERS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "MY_VOUCHERS"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            My Active Vouchers ({redemptions.length})
          </button>
        </div>

        {activeTab === "CATALOG" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Category:</span>
            {["ALL", "DINING", "VOUCHER", "COMMUTE", "DONATION"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  filterCategory === cat
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading rewards marketplace...</div>
      ) : activeTab === "CATALOG" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = userPoints >= reward.pointsCost;

            return (
              <Card key={reward.id} className="glass-card flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div>
                  <CardHeader className="pb-3 border-b border-slate-800/60">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                          {getRewardIcon(reward.category)}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-white">{reward.title}</CardTitle>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Category: {reward.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    <p className="text-xs text-slate-300 min-h-[36px]">{reward.description}</p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                      <span className="text-slate-400">Stock Remaining:</span>
                      <span className="font-semibold text-slate-200">{reward.stock} Vouchers</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 rounded-b-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Cost</span>
                    <span className="text-base font-extrabold text-amber-400">{reward.pointsCost} PTS</span>
                  </div>

                  <Button
                    onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                    variant={canAfford ? "eco" : "outline"}
                    size="sm"
                    disabled={!canAfford || processingId === reward.id || reward.stock <= 0}
                    className="text-xs gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {processingId === reward.id
                      ? "Redeeming..."
                      : reward.stock <= 0
                      ? "Sold Out"
                      : canAfford
                      ? "Redeem Now"
                      : "Insufficient Pts"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* My Active Vouchers Tab */
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <Card className="glass-card text-center p-8">
              <Gift className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Vouchers Redeemed Yet</p>
              <p className="text-xs text-slate-400 mt-1">Browse the catalog above to claim your first reward!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {redemptions.map((rdm) => (
                <Card key={rdm.id} className="glass-card border-emerald-500/30">
                  <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRewardIcon(rdm.reward?.category || "DINING")}
                        <CardTitle className="text-sm font-bold text-white">{rdm.reward?.title || "Eco Voucher"}</CardTitle>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ACTIVE VOUCHER
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="bg-slate-900 border border-dashed border-emerald-500/50 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Redemption Voucher Code</span>
                        <code className="text-base font-mono font-bold text-emerald-400">{rdm.voucherCode}</code>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(rdm.voucherCode)}
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedCode === rdm.voucherCode ? "Copied!" : "Copy"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Spent: {rdm.pointsSpent} PTS</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-400" />
                        Expires: {new Date(rdm.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
