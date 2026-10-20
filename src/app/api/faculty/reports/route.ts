import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const reports = prebackend.getAllReports({ status });
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Faculty reports GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { reportId, status, pointsAwarded = 50, feedback } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: "Report ID and status (VERIFIED/REJECTED) are required." },
        { status: 400 }
      );
    }

    const awardPts = Number(pointsAwarded) || 50;

    // Update in Pre-Backend store
    const updated = prebackend.updateReport(reportId, {
      status,
      pointsAwarded: awardPts,
      feedback: feedback || (status === "VERIFIED" ? "Verified by Faculty Sustainability Board." : "Report reviewed and dismissed."),
    });

    // Optional background sync with Prisma
    try {
      await prisma.studentReport.update({
        where: { id: reportId },
        data: {
          status,
          pointsAwarded: status === "VERIFIED" ? awardPts : 0,
          feedback: feedback || (status === "VERIFIED" ? "Verified by Faculty." : "Report reviewed and dismissed."),
          verifiedAt: new Date(),
        },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: `Report status updated to '${status}'. ${
        status === "VERIFIED" ? `+${awardPts} Eco-Points awarded to student!` : ""
      }`,
      report: updated,
    });
  } catch (error) {
    console.error("Faculty report review POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
