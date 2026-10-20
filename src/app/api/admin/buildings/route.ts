import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();

    // 1. Fetch from Pre-Backend persistent store
    const buildings = prebackend.getAllBuildings();

    // 2. Optional Prisma fallback/sync
    if (buildings.length === 0) {
      try {
        const dbBuildings = await prisma.building.findMany({
          orderBy: { code: "asc" },
          include: { meters: true, workOrders: true, anomalies: true },
        });
        if (dbBuildings.length > 0) {
          return NextResponse.json({ success: true, buildings: dbBuildings });
        }
      } catch {
        // Prisma offline
      }
    }

    return NextResponse.json({ success: true, buildings });
  } catch (error) {
    console.error("Admin buildings GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      name,
      code,
      category = "ACADEMIC",
      grossFloorAreaSqM = 10000,
      occupancyCapacity = 500,
      solarPanelsInstalled = false,
      rainwaterHarvesting = false,
      currentEnergyRating = "LEED Gold",
      yearBuilt = 2024,
    } = body;

    if (!name || !code) {
      return NextResponse.json({ error: "Building name and code are required." }, { status: 400 });
    }

    // Persist to Pre-Backend store
    const createdBuilding = prebackend.createBuilding({
      name,
      code,
      category,
      grossFloorAreaSqM: Number(grossFloorAreaSqM) || 10000,
      occupancyCapacity: Number(occupancyCapacity) || 500,
      solarPanelsInstalled: Boolean(solarPanelsInstalled),
      rainwaterHarvesting: Boolean(rainwaterHarvesting),
      currentEnergyRating,
      yearBuilt: Number(yearBuilt) || 2024,
    });

    // Optional background sync with Prisma if online
    try {
      await prisma.building.create({
        data: {
          id: createdBuilding.id,
          name,
          code,
          category: category as any,
          grossFloorAreaSqM: Number(grossFloorAreaSqM) || 10000,
          occupancyCapacity: Number(occupancyCapacity) || 500,
          solarPanelsInstalled: Boolean(solarPanelsInstalled),
          rainwaterHarvesting: Boolean(rainwaterHarvesting),
          currentEnergyRating,
        },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: `Building '${name}' added to campus infrastructure model & smart meter initialized.`,
      building: createdBuilding,
    });
  } catch (error) {
    console.error("Admin building POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
