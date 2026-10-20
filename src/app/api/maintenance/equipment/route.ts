import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const meters = prebackend.getAllMeters();

    const equipment = meters.map((m) => {
      const topReading = m.readings && m.readings.length > 0 ? m.readings[0] : null;
      return {
        id: m.id,
        name: `${m.building.name} Smart ${m.meterType} Meter`,
        serialNumber: m.meterSerial,
        category: m.meterType,
        status: m.status,
        location: m.locationDescription,
        lastTelemetry: m.lastTelemetryAt || new Date().toISOString(),
        currentValue: topReading?.value || 24.5,
        unit: m.unitOfMeasure,
      };
    });

    return NextResponse.json({ success: true, equipment });
  } catch (error) {
    console.error("Maintenance equipment API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
