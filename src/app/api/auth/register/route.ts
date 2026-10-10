import { NextRequest, NextResponse } from "next/server";
import { signJWT, AUTH_COOKIE_NAME } from "@/lib/jwt";
import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@/types/auth";
import { getRoleDefaultPath } from "@/lib/rbac";

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

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this institutional email already exists." },
          { status: 409 }
        );
      }

      const passwordHash = await hashPassword(password);

      // Create user and profile in transaction
      const newUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email: normalizedEmail,
            passwordHash,
            role: role as Role,
            department: department || null,
            studentId: role === "STUDENT" ? studentId || null : null,
            staffId: role !== "STUDENT" ? staffId || null : null,
          },
        });

        await tx.profile.create({
          data: {
            userId: user.id,
            totalEcoPoints: role === "STUDENT" ? 100 : 50, // Welcome points
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_REGISTERED",
            entityType: "User",
            entityId: user.id,
            metadata: JSON.stringify({ role, department }),
          },
        });

        return user;
      });

      const token = await signJWT({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role as Role,
        department: newUser.department,
      });

      const response = NextResponse.json({
        success: true,
        message: "Account registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          department: newUser.department,
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
    } catch (dbError) {
      console.error("Prisma error during registration:", dbError);
      return NextResponse.json(
        {
          error:
            "Database error. Please check your PostgreSQL connection string in .env.",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
