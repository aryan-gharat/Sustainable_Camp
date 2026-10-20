import { NextRequest, NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import prebackend from "@/lib/prebackend";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || undefined;
    const search = searchParams.get("search") || undefined;

    const users = prebackend.getAllUsers({ role, search });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { name, email, password = "green2026!", role = "STUDENT", department, studentId, staffId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = prebackend.getUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    // Save to prebackend store
    const newUser = prebackend.createUser({
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      department: department || null,
      studentId: studentId || null,
      staffId: staffId || null,
      initialEcoPoints: 100,
    });

    // Optional background sync with Prisma if online
    try {
      await prisma.user.create({
        data: {
          id: newUser.id,
          name,
          email: normalizedEmail,
          passwordHash,
          role,
          department: department || null,
          studentId: studentId || null,
          staffId: staffId || null,
          profile: {
            create: {
              totalEcoPoints: 100,
            },
          },
        },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: `User '${name}' created and saved in campus directory with role ${role}!`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        ecoPoints: newUser.profile.totalEcoPoints,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Admin user POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { userId, role, isActive } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (typeof isActive === "boolean") updates.isActive = isActive;

    const updatedUser = prebackend.updateUser(userId, updates);

    // Optional background sync
    try {
      await prisma.user.update({
        where: { id: userId },
        data: updates,
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: "User role / access status updated and saved successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin user PUT error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    prebackend.deleteUser(userId);

    // Optional background sync
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch {
      // Prisma offline
    }

    return NextResponse.json({
      success: true,
      message: "User account removed from database.",
    });
  } catch (error) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
