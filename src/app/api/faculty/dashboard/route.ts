import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const rawDb = prebackend.getRawDb();

    let departmentName = "Dept of Renewable Energy & Smart Grid Systems";
    if (userId) {
      const u = prebackend.getUserById(userId);
      if (u?.department) departmentName = u.department;
    }

    const pendingReportsCount = rawDb.studentReports.filter((r) => r.status === "PENDING").length;
    const activeEventsCount = rawDb.campusEvents.length;
    const studentUsers = rawDb.users.filter((u) => u.role === "STUDENT");
    const totalStudentsTracked = studentUsers.length > 0 ? studentUsers.length : 142;

    const recentActivity = rawDb.studentReports.slice(0, 3).map((r, idx) => {
      const student = rawDb.users.find((u) => u.id === r.userId);
      return {
        id: `fac-act-${idx + 1}`,
        type: r.status === "PENDING" ? "REPORT_PENDING" : "REPORT_VERIFIED",
        title: r.title,
        studentName: student ? student.name : "Student Eco-Advocate",
        date: "Recent",
        status: r.status === "PENDING" ? "PENDING_REVIEW" : "VERIFIED",
      };
    });

    return NextResponse.json({
      success: true,
      department: {
        name: departmentName,
        energyDrawKw: 28.4,
        energyDrawChange: "-14.2%",
        totalStudentsTracked,
        pendingReportsCount,
        activeEventsCount,
        totalCarbonOffsetKg: 1850.0,
        departmentRank: 1,
        labEnergyRating: "A- (LEED Platinum Index)",
        activeSensorsPercent: 98.2,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Faculty dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
