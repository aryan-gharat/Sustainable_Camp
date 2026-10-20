import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const rawDb = prebackend.getRawDb();

    let totalPoints = 580;
    let carbonSavedKg = 122.4;
    let waterSavedLiters = 1400.0;
    let streakDays = 19;
    let verifiedReportsCount = 2;
    let upcomingEventsCount = rawDb.campusEvents.length;
    let activeQuestsCount = rawDb.greenQuests.length;
    let campusRank = 4;

    if (userId) {
      const user = prebackend.getUserById(userId);
      const profile = prebackend.getProfileByUserId(userId);

      if (profile) {
        totalPoints = profile.totalEcoPoints;
        carbonSavedKg = profile.carbonSavedKg;
        waterSavedLiters = profile.waterSavedLiters;
        streakDays = profile.streakDays;
      }

      const userReports = rawDb.studentReports.filter((r) => r.userId === userId);
      verifiedReportsCount = userReports.filter((r) => r.status === "VERIFIED" || r.status === "RESOLVED").length;

      const userRegistrations = rawDb.eventRegistrations.filter((er) => er.userId === userId);
      upcomingEventsCount = userRegistrations.length > 0 ? userRegistrations.length : rawDb.campusEvents.length;

      // Dynamic rank calculation
      const allStudentProfiles = rawDb.users
        .filter((u) => u.role === "STUDENT")
        .map((u) => {
          const p = rawDb.profiles.find((prof) => prof.userId === u.id);
          return p?.totalEcoPoints ?? 0;
        })
        .sort((a, b) => b - a);

      const rankIndex = allStudentProfiles.findIndex((pts) => pts <= totalPoints);
      campusRank = rankIndex !== -1 ? rankIndex + 1 : 1;
    }

    // Dynamic recent activity logs for this student
    const recentActivity: any[] = [];
    if (userId) {
      const userLogs = rawDb.ecoPointLogs
        .filter((l) => l.userId === userId)
        .slice(-4)
        .reverse();

      for (const log of userLogs) {
        recentActivity.push({
          id: log.id,
          type: log.points > 0 ? "POINTS_AWARDED" : "REWARD_REDEEMED",
          title: log.reason,
          points: log.points,
          date: "Recently",
          status: log.points > 0 ? "VERIFIED" : "REDEEMED",
        });
      }
    }

    if (recentActivity.length === 0) {
      recentActivity.push(
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
        }
      );
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
      recentActivity,
    });
  } catch (error) {
    console.error("Student dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
