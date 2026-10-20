import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;

    const rawDb = prebackend.getRawDb();
    let studentUsers = rawDb.users.filter((u) => u.role === "STUDENT");

    if (search) {
      const q = search.toLowerCase().trim();
      studentUsers = studentUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }

    const students = studentUsers.map((u) => {
      const profile = rawDb.profiles.find((p) => p.userId === u.id);
      const completions = rawDb.questCompletions.filter((q) => q.userId === u.id && q.status === "APPROVED");
      const reports = rawDb.studentReports.filter((r) => r.userId === u.id && r.status === "VERIFIED");

      const pts = profile?.totalEcoPoints ?? 0;
      const tier =
        pts >= 1000
          ? "Tier 5 Eco Luminary"
          : pts >= 600
          ? "Tier 4 Green Pioneer"
          : pts >= 300
          ? "Tier 3 Eco Advocate"
          : "Tier 2 Campus Scout";

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        studentId: u.studentId || "STU-REG",
        department: u.department || "General Eco-Member",
        totalEcoPoints: pts,
        carbonSavedKg: profile?.carbonSavedKg ?? 0,
        waterSavedLiters: profile?.waterSavedLiters ?? 0,
        streakDays: profile?.streakDays ?? 1,
        completedQuestsCount: completions.length,
        verifiedReportsCount: reports.length,
        lastActive: u.updatedAt,
        tier,
      };
    });

    students.sort((a, b) => b.totalEcoPoints - a.totalEcoPoints);

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Faculty student-tracking API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { studentId, points, reason } = body;

    if (!studentId || !points) {
      return NextResponse.json({ error: "Student ID and points are required." }, { status: 400 });
    }

    const awardPoints = Number(points) || 50;
    const finalReason = reason || "Faculty Academic Commendation";

    // Award points in Pre-Backend store
    prebackend.adjustEcoPoints(studentId, awardPoints, finalReason);

    // Optional background sync with Prisma
    try {
      await prisma.ecoPointLog.create({
        data: {
          userId: studentId,
          points: awardPoints,
          reason: finalReason,
        },
      });
      await prisma.profile.update({
        where: { userId: studentId },
        data: { totalEcoPoints: { increment: awardPoints } },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: `Successfully awarded +${awardPoints} Eco-Points to student for '${finalReason}'!`,
    });
  } catch (error) {
    console.error("Faculty award points error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
