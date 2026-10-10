import { SignJWT, jwtVerify } from "jose";
import { JWTPayload, Role } from "@/types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "greencampus_ai_super_secure_jwt_secret_token_change_in_production_2026";

const secretKey = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = "greencampus_auth_token";

/**
 * Sign a JWT token with user session payload (Edge-runtime compatible)
 */
export async function signJWT(
  payload: Omit<JWTPayload, "iat" | "exp">
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(secretKey);
}

/**
 * Verify and decode a JWT token (Edge-runtime compatible)
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
