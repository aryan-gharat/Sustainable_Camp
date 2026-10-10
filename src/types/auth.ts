export type Role = "STUDENT" | "FACULTY" | "ADMIN" | "MAINTENANCE_STAFF";

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  department?: string | null;
  iat?: number;
  exp?: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string | null;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: SessionUser;
  token?: string;
}

export interface RoleConfig {
  role: Role;
  displayName: string;
  tagline: string;
  defaultRoute: string;
  allowedPrefixes: string[];
  themeColor: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    glow: string;
  };
}
