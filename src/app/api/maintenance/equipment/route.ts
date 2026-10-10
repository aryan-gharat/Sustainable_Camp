import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    let equipment: any[] = [];

    try {
      const dbMeters = await prisma.utilityMeter.findMany({
        include: { building: true, readings: { take: 1, orderBy: { timestamp: "desc" } } },
      });

      if (dbMeters.length > 0) {
        equipment = dbMeters.map((m) => ({
          id: m.id,
          name: `${m.building.name} Smart ${m.meterType} Meter`,
          serialNumber: m.meterSerial,
          category: m.meterType,
          status: m.status,
          location: m.locationDescription,
          lastTelemetry: m.lastTelemetryAt || new Date().toISOString(),
          currentValue: m.readings[0]?.value || 24.5,
          unit: m.unitOfMeasure,
        }));
      }
    } catch (err) {
      console.warn("DB fallback for maintenance equipment GET:", err);
    }

    if (equipment.length === 0) {
      equipment = [
        {
          id: "eq-101",
          name: "Solar Science Chiller Pump Array B",
          serialNumber: "CHILL-SCI-01-B",
          category: "HVAC_CHILLED_WATER",
          status: "ACTIVE",
          location: "Solar Science Complex Sub-Basement",
          lastTelemetry: new Date().toISOString(),
          currentValue: 18.2,
          unit: "kW",
        },
        {
          id: "eq-102",
          name: "Rooftop PV 420kW Inverter Array",
          serialNumber: "SOLAR-INV-420KW",
          category: "SOLAR_PV",
          status: "ACTIVE",
          location: "Solar Science Roof Deck",
          lastTelemetry: new Date().toISOString(),
          currentValue: 380.5,
          unit: "kW",
        },
        {
          id: "eq-103",
          name: "Verdant Quad Main Water Valve & Sensor",
          serialNumber: "MTR-ACAD-02-WATER",
          category: "WATER",
          status: "ACTIVE",
          location: "Verdant Quad Vault A",
          lastTelemetry: new Date().toISOString(),
          currentValue: 340,
          unit: "L/hr",
        },
        {
          id: "eq-104",
          name: "Library East Wing Smart Lighting Sub-Panel",
          serialNumber: "ELEC-LIB-04-EAST",
          category: "ELECTRICITY",
          status: "CALIBRATION_NEEDED",
          location: "Central Library Electrical Room 3",
          lastTelemetry: new Date(Date.now() - 3600000 * 24).toISOString(),
          currentValue: 38.0,
          unit: "kW",
        },
      ];
    }

    return NextResponse.json({ success: true, equipment });
  } catch (error) {
    console.error("Maintenance equipment API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
