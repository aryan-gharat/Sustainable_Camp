import { NextRequest, NextResponse } from "next/server";
import { signJWT, AUTH_COOKIE_NAME } from "@/lib/jwt";
import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/types/auth";
import { getRoleDefaultPath } from "@/lib/rbac";
import prebackend from "@/lib/prebackend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, department, studentId, staffId } = body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required." },
        { status: 400 }
      );
    }

    const validRoles: Role[] = ["STUDENT", "FACULTY", "ADMIN", "MAINTENANCE_STAFF"];
    if (!validRoles.includes(role as Role)) {
      return NextResponse.json(
        { error: `Invalid role selected. Allowed: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists in Pre-Backend store
    const existingPreUser = prebackend.getUserByEmail(normalizedEmail);
    if (existingPreUser) {
      return NextResponse.json(
        { error: "An account with this institutional email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // 2. Persist to Pre-Backend persistent store
    const newUser = prebackend.createUser({
      name,
      email: normalizedEmail,
      passwordHash,
      role: role as Role,
      department: department || null,
      studentId: role === "STUDENT" ? studentId || null : null,
      staffId: role !== "STUDENT" ? staffId || null : null,
      initialEcoPoints: role === "STUDENT" ? 100 : 50,
    });

    // 3. Optional Prisma background sync if PostgreSQL is active
    try {
      await prisma.user.create({
        data: {
          id: newUser.id,
          name,
          email: normalizedEmail,
          passwordHash,
          role: role as Role,
          department: department || null,
          studentId: role === "STUDENT" ? studentId || null : null,
          staffId: role !== "STUDENT" ? staffId || null : null,
          profile: {
            create: {
              totalEcoPoints: role === "STUDENT" ? 100 : 50,
            },
          },
        },
      });
    } catch {
      // Prisma offline, Pre-Backend is primary
    }

    const token = await signJWT({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as Role,
      department: newUser.department,
    });

    const response = NextResponse.json({
      success: true,
      message: "Campus account registered and stored successfully!",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
        ecoPoints: newUser.profile.totalEcoPoints,
      },
      defaultRedirect: getRoleDefaultPath(newUser.role as Role),
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
