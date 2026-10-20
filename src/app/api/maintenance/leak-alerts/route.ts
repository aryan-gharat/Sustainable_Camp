import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const alerts = prebackend.getAllAlerts();
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error("Maintenance leak-alerts API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
