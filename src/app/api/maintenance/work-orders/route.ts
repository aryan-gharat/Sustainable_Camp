import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const workOrders = prebackend.getAllWorkOrders({ status });
    return NextResponse.json({ success: true, workOrders });
  } catch (error) {
    console.error("Maintenance work-orders GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const engineerUserId = session?.userId;
    const body = await request.json();

    const {
      workOrderId,
      title,
      description,
      category,
      priority,
      status,
      locationDetails,
      buildingName,
      resolutionNotes,
      actualCarbonSavedKg = 30.0,
    } = body;

    // Case 1: Create a new Work Order
    if (!workOrderId && title) {
      const createdWO = prebackend.createWorkOrder({
        title,
        description: description || "Manual Maintenance Request",
        category: category || "GENERAL_REPAIR",
        priority: priority || "MEDIUM",
        status: status || "SUBMITTED",
        locationDetails: locationDetails || "Campus Facilities",
        buildingName: buildingName || "Main Quad",
        reportedById: engineerUserId || "usr-mnt-01",
        assignedToId: "usr-mnt-01",
        estimatedCarbonLossKg: 25.0,
      });

      return NextResponse.json({
        success: true,
        message: `Work Order ${createdWO.workOrderNumber} created successfully!`,
        workOrder: createdWO,
      });
    }

    // Case 2: Update existing Work Order status
    if (!workOrderId || !status) {
      return NextResponse.json({ error: "Work order ID and status are required." }, { status: 400 });
    }

    const updateResult = prebackend.updateWorkOrder(workOrderId, {
      status,
      resolutionNotes,
      actualCarbonSavedKg: Number(actualCarbonSavedKg) || 30.0,
    });

    if (!updateResult) {
      return NextResponse.json({ error: "Work order not found." }, { status: 404 });
    }

    // Optional background sync with Prisma
    try {
      await prisma.workOrder.update({
        where: { id: workOrderId },
        data: {
          status,
          resolutionNotes: resolutionNotes || (status === "RESOLVED" ? "Issue repaired by Maintenance." : null),
          resolvedAt: status === "RESOLVED" ? new Date() : undefined,
        },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: `Work Order status updated to '${status}'. ${updateResult.studentNotice}`,
      workOrder: updateResult.workOrder,
    });
  } catch (error) {
    console.error("Maintenance work-order POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
