import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || undefined;

    let reports = prebackend.getAllReports({ status });

    if (category && category !== "ALL") {
      reports = reports.filter((r) => r.category === category);
    }

    // If student, sort their own reports to the top or filter if requested
    const showOnlyMine = searchParams.get("myReports") === "true";
    if (showOnlyMine && userId) {
      reports = reports.filter((r) => r.userId === userId);
    }

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Student reports GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId || "usr-stu-01";
    const body = await request.json();

    const { title, category, description, location, buildingName, impactEstKgCo2, proofUrl } = body;

    if (!title || !category || !description || !location) {
      return NextResponse.json(
        { error: "Title, category, description, and location are required." },
        { status: 400 }
      );
    }

    // Persist report into Pre-Backend store and award +20 points
    const createdReport = prebackend.createReport({
      userId,
      title,
      category,
      description,
      location,
      buildingName: buildingName || null,
      impactEstKgCo2: parseFloat(impactEstKgCo2) || 15.0,
      proofUrl: proofUrl || null,
    });

    // Optional background sync with Prisma
    try {
      await prisma.studentReport.create({
        data: {
          id: createdReport.id,
          userId,
          title,
          category,
          description,
          location,
          buildingName: buildingName || null,
          impactEstKgCo2: parseFloat(impactEstKgCo2) || 15.0,
          proofUrl: proofUrl || null,
          status: "PENDING",
          pointsAwarded: 20,
        },
      });
      await prisma.ecoPointLog.create({
        data: {
          userId,
          points: 20,
          reason: `Submitted sustainability report: ${title}`,
        },
      });
      await prisma.profile.update({
        where: { userId },
        data: { totalEcoPoints: { increment: 20 } },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: "Sustainability report submitted and saved! +20 Eco-Points logged.",
      report: createdReport,
    });
  } catch (error) {
    console.error("Student report POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
