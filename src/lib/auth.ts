import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, signJWT, verifyJWT } from "./jwt";
import { JWTPayload, Role, SessionUser } from "@/types/auth";
import prisma from "./prisma";

const SALT_ROUNDS = 10;

/**
 * Hash plain text password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plain text password against bcrypt hash
 */
export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

/**
 * Create HTTP-only session cookie for authenticated user
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Retrieve current authenticated session from cookies
 */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifyJWT(token);
  } catch {
    return null;
  }
}

/**
 * Retrieve detailed user profile from database based on current session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatarUrl: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      department: user.department,
      avatarUrl: user.avatarUrl,
    };
  } catch (error) {
    // If database connection is not active yet (e.g., local mock or setup stage), fallback to session data
    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      department: session.department || null,
      avatarUrl: null,
    };
  }
}
