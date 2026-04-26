import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

const RATE_LIMIT_WINDOW_MS = 1000 * 60 * 10;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

const loginAttempts = new Map<
  string,
  { count: number; firstAttemptAt: number; blockedUntil: number | null }
>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function getRateLimitState(key: string, now: number) {
  const current = loginAttempts.get(key);

  if (!current) {
    const fresh = {
      count: 0,
      firstAttemptAt: now,
      blockedUntil: null,
    };

    loginAttempts.set(key, fresh);
    return fresh;
  }

  if (current.blockedUntil && current.blockedUntil > now) {
    return current;
  }

  if (now - current.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
    const fresh = {
      count: 0,
      firstAttemptAt: now,
      blockedUntil: null,
    };

    loginAttempts.set(key, fresh);
    return fresh;
  }

  if (current.blockedUntil && current.blockedUntil <= now) {
    current.count = 0;
    current.firstAttemptAt = now;
    current.blockedUntil = null;
  }

  return current;
}

export async function POST(request: Request) {
  const now = Date.now();
  const clientKey = getClientKey(request);
  const rateLimit = getRateLimitState(clientKey, now);
  const { password } = (await request.json()) as { password?: string };
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (rateLimit.blockedUntil && rateLimit.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((rateLimit.blockedUntil - now) / 1000);

    return NextResponse.json(
      { error: "Too many attempts. Please wait a bit." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      },
    );
  }

  if (!passwordHash || !sessionSecret) {
    return NextResponse.json(
      { error: "Admin auth is not configured." },
      { status: 500 },
    );
  }

  if (!password || !verifyAdminPassword(password, passwordHash)) {
    rateLimit.count += 1;

    if (rateLimit.count >= RATE_LIMIT_MAX_ATTEMPTS) {
      rateLimit.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    }

    return NextResponse.json(
      { error: "this isn't for you" },
      { status: 401 },
    );
  }

  loginAttempts.delete(clientKey);

  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(sessionSecret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
