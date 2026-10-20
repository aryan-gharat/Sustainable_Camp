import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET() {
  try {
    const session = await getSession();
    const events = prebackend.getAllEvents();
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Faculty events GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      title,
      category = "WORKSHOP",
      description,
      location,
      eventDate,
      durationMinutes = 120,
      ecoPoints = 100,
      capacity = 50,
      organizer = "Dept of Renewable Energy",
    } = body;

    if (!title || !description || !location || !eventDate) {
      return NextResponse.json(
        { error: "Title, description, location, and event date are required." },
        { status: 400 }
      );
    }

    const createdEvent = prebackend.createEvent({
      title,
      category,
      description,
      location,
      eventDate,
      durationMinutes: Number(durationMinutes) || 120,
      ecoPoints: Number(ecoPoints) || 100,
      capacity: Number(capacity) || 50,
      organizer,
    });

    // Optional background sync with Prisma
    try {
      await prisma.campusEvent.create({
        data: {
          id: createdEvent.id,
          title,
          category,
          description,
          location,
          eventDate: new Date(eventDate),
          durationMinutes: Number(durationMinutes) || 120,
          ecoPoints: Number(ecoPoints) || 100,
          capacity: Number(capacity) || 50,
          organizer,
        },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: "Campus green event published and saved successfully!",
      event: createdEvent,
    });
  } catch (error) {
    console.error("Faculty event POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("id");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    prebackend.deleteEvent(eventId);

    // Optional background sync
    try {
      await prisma.campusEvent.delete({
        where: { id: eventId },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: "Event cancelled successfully.",
    });
  } catch (error) {
    console.error("Faculty event DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
