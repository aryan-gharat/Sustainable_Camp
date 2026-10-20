import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.userId;
    const rawDb = prebackend.getRawDb();

    let engineerName = "Carlos Mendez";
    if (userId) {
      const u = prebackend.getUserById(userId);
      if (u?.name) engineerName = u.name;
    }

    const activeWorkOrdersCount = rawDb.workOrders.filter(
      (w) => w.status !== "RESOLVED" && w.status !== "CANCELLED"
    ).length;

    const inProgressCount = rawDb.workOrders.filter((w) => w.status === "IN_PROGRESS").length;
    const resolvedTodayCount = rawDb.workOrders.filter((w) => w.status === "RESOLVED").length;
    const activeLeakAlertsCount = rawDb.anomalyAlerts.filter((a) => !a.isResolved).length;

    const urgentWorkOrdersPreview = rawDb.workOrders
      .filter((w) => w.status !== "RESOLVED" && w.status !== "CANCELLED")
      .slice(0, 3)
      .map((w) => ({
        id: w.id,
        workOrderNumber: w.workOrderNumber,
        title: w.title,
        category: w.category,
        priority: w.priority,
        status: w.status,
        locationDetails: w.locationDetails,
        buildingName: w.buildingName || "Campus Infrastructure",
        reportedBy: "Student Eco-Advocate",
        estimatedCarbonLossKg: w.estimatedCarbonLossKg,
        createdAt: w.createdAt,
      }));

    return NextResponse.json({
      success: true,
      engineer: {
        name: engineerName,
        activeWorkOrdersCount,
        inProgressCount,
        resolvedTodayCount,
        totalCarbonPreventedKg: 680.0,
        activeLeakAlertsCount,
      },
      urgentWorkOrdersPreview,
    });
  } catch (error) {
    console.error("Maintenance dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
