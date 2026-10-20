import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId || "usr-stu-01";
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let events = prebackend.getAllEvents(userId);

    if (category && category !== "ALL") {
      events = events.filter((e) => e.category === category);
    }

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Campus events GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId || "usr-stu-01";
    const body = await request.json();
    const { eventId, action } = body; // action: "REGISTER" | "CANCEL" | "CLAIM_POINTS"

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    let message = "";

    if (action === "REGISTER") {
      prebackend.registerForEvent(eventId, userId);
      message = "Successfully registered for campus sustainability event!";

      // Optional background sync with Prisma
      try {
        await prisma.eventRegistration.upsert({
          where: { eventId_userId: { eventId, userId } },
          update: {},
          create: { eventId, userId },
        });
      } catch {
        // Prisma offline
      }
    } else if (action === "CANCEL") {
      prebackend.cancelEventRegistration(eventId, userId);
      message = "Event registration cancelled.";

      try {
        await prisma.eventRegistration.deleteMany({
          where: { eventId, userId },
        });
      } catch {
        // Prisma offline
      }
    } else if (action === "CLAIM_POINTS") {
      const claimResult = prebackend.claimEventPoints(eventId, userId);
      message = `Event attendance verified! +${claimResult.points} Eco-Points claimed.`;

      try {
        const reg = await prisma.eventRegistration.findUnique({
          where: { eventId_userId: { eventId, userId } },
          include: { event: true },
        });
        if (reg) {
          await prisma.eventRegistration.update({
            where: { id: reg.id },
            data: { attended: true, pointsClaimed: true },
          });
          await prisma.ecoPointLog.create({
            data: {
              userId,
              points: reg.event.ecoPoints,
              reason: `Attended event: ${reg.event.title}`,
            },
          });
          await prisma.profile.update({
            where: { userId },
            data: { totalEcoPoints: { increment: reg.event.ecoPoints } },
          });
        }
      } catch {
        // Prisma offline
      }
    } else {
      return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Campus events POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
