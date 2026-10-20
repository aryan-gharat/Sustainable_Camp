import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    const leaderboard = prebackend.getLeaderboard(10);
    const profile = userId ? prebackend.getProfileByUserId(userId) : null;
    const user = userId ? prebackend.getUserById(userId) : null;

    let currentUserRank = {
      rank: 4,
      name: user?.name || "Aiden Sharma",
      totalEcoPoints: profile?.totalEcoPoints || 580,
      carbonSavedKg: profile?.carbonSavedKg || 122.4,
      streakDays: profile?.streakDays || 19,
    };

    if (userId) {
      const idx = leaderboard.students.findIndex((s) => s.id === userId);
      if (idx !== -1) {
        currentUserRank = {
          rank: idx + 1,
          name: leaderboard.students[idx].name,
          totalEcoPoints: leaderboard.students[idx].totalEcoPoints,
          carbonSavedKg: leaderboard.students[idx].carbonSavedKg,
          streakDays: leaderboard.students[idx].streakDays,
        };
      }
    }

    return NextResponse.json({
      success: true,
      currentUserRank,
      students: leaderboard.students,
      dorms: leaderboard.dorms,
      departments: leaderboard.departments,
    });
  } catch (error) {
    console.error("Student leaderboard GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
