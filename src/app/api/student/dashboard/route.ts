import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    let userProfile = null;
    let totalPoints = 580;
    let carbonSavedKg = 122.4;
    let waterSavedLiters = 1400.0;
    let streakDays = 19;
    let activeQuestsCount = 3;
    let verifiedReportsCount = 2;
    let upcomingEventsCount = 4;
    let campusRank = 4;

    if (userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            profile: true,
            questCompletions: { include: { quest: true } },
            sustainabilityReports: true,
            eventRegistrations: { include: { event: true } },
            carbonCalculations: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        });

        if (user && user.profile) {
          totalPoints = user.profile.totalEcoPoints;
          carbonSavedKg = user.profile.carbonSavedKg;
          waterSavedLiters = user.profile.waterSavedLiters;
          streakDays = user.profile.streakDays;
          verifiedReportsCount = user.sustainabilityReports.filter(r => r.status === "VERIFIED").length;
          upcomingEventsCount = user.eventRegistrations.filter(er => new Date(er.event.eventDate) > new Date()).length;
        }

        // Calculate rank if DB active
        const higherScoringUsers = await prisma.profile.count({
          where: { totalEcoPoints: { gt: totalPoints } },
        });
        campusRank = higherScoringUsers + 1;
      } catch (err) {
        console.warn("Database fallback for student dashboard API:", err);
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalEcoPoints: totalPoints,
        carbonSavedKg,
        waterSavedLiters,
        streakDays,
        campusRank,
        activeQuestsCount,
        verifiedReportsCount,
        upcomingEventsCount,
      },
      recentActivity: [
        {
          id: "act-1",
          type: "QUEST_COMPLETED",
          title: "Campus Zero-Waste Dining Week",
          points: 120,
          date: "2 hours ago",
          status: "VERIFIED",
        },
        {
          id: "act-2",
          type: "REPORT_SUBMITTED",
          title: "Science Lab 3 Chilled Water Leak",
          points: 50,
          date: "1 day ago",
          status: "VERIFIED",
        },
        {
          id: "act-3",
          type: "EVENT_REGISTERED",
          title: "Quad Tree Planting Drive 2026",
          points: 100,
          date: "2 days ago",
          status: "UPCOMING",
        },
        {
          id: "act-4",
          type: "REWARD_REDEEMED",
          title: "15% Off Green Campus Cafe",
          points: -150,
          date: "3 days ago",
          status: "REDEEMED",
        },
      ],
    });
  } catch (error) {
    console.error("Student dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
