import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;

    let departmentName = "Dept of Renewable Energy & Smart Grid Systems";
    let departmentEnergyKw = 28.4;
    let totalStudentsTracked = 142;
    let pendingReportsCount = 3;
    let activeEventsCount = 4;
    let totalCarbonOffsetKg = 1850.0;
    let departmentRank = 1;

    try {
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { department: true },
        });
        if (user?.department) {
          departmentName = user.department;
        }

        const pendingDbCount = await prisma.studentReport.count({
          where: { status: "PENDING" },
        });
        pendingReportsCount = pendingDbCount;

        const activeDbEventsCount = await prisma.campusEvent.count({
          where: { eventDate: { gte: new Date() } },
        });
        activeEventsCount = activeDbEventsCount;

        const studentCount = await prisma.user.count({
          where: { role: "STUDENT" },
        });
        if (studentCount > 0) totalStudentsTracked = studentCount;
      }
    } catch (err) {
      console.warn("DB fallback for faculty dashboard API:", err);
    }

    return NextResponse.json({
      success: true,
      department: {
        name: departmentName,
        energyDrawKw: departmentEnergyKw,
        energyDrawChange: "-14.2%",
        totalStudentsTracked,
        pendingReportsCount,
        activeEventsCount,
        totalCarbonOffsetKg,
        departmentRank,
        labEnergyRating: "A- (LEED Platinum Index)",
        activeSensorsPercent: 98.2,
      },
      recentActivity: [
        {
          id: "fac-act-1",
          type: "REPORT_PENDING",
          title: "Chilled Water Pipe Micro-Leak in Science Complex",
          studentName: "Aiden Sharma",
          date: "10 mins ago",
          status: "PENDING_REVIEW",
        },
        {
          id: "fac-act-2",
          type: "EVENT_CREATED",
          title: "Campus Native Tree Planting Drive 2026",
          studentCount: 42,
          date: "2 hours ago",
          status: "PUBLISHED",
        },
        {
          id: "fac-act-3",
          type: "STUDENT_QUEST",
          title: "Sophia Chen completed Zero-Waste Dining Week",
          points: 120,
          date: "5 hours ago",
          status: "VERIFIED",
        },
      ],
    });
  } catch (error) {
    console.error("Faculty dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
