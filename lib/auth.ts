import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import type { JWTPayload, UserRole } from "./types"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production")

const ACCESS_TOKEN_EXPIRY = "15m"
const REFRESH_TOKEN_EXPIRY = "7d"

export async function generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function generateRefreshToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    return null
  }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  
  const isProduction = process.env.NODE_ENV === "production"
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Only HTTPS in production
    sameSite: "lax" as const,
    path: "/",
  }

  cookieStore.set("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60, // 15 minutes
  })

  cookieStore.set("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")
}

export async function getAuthFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")?.value

  if (!accessToken) {
    return null
  }

  return verifyToken(accessToken)
}

// Helper for API routes to get userId quickly
export async function verifyAuth(req: NextRequest): Promise<string | null> {
  const auth = await getAuthFromCookies()
  if (auth && auth.userId) {
    return auth.userId
  }
  return null
}

import bcrypt from "bcryptjs"

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function roleGuard(allowedRoles: UserRole[]) {
  return async function guard(): Promise<JWTPayload | null> {
    const auth = await getAuthFromCookies()

    if (!auth) {
      return null
    }

    if (!allowedRoles.includes(auth.role)) {
      return null
    }

    return auth
  }
}
