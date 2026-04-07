import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!passwordHash || !sessionSecret) {
    return NextResponse.json(
      { error: "Admin auth is not configured." },
      { status: 500 },
    );
  }

  if (!password || !verifyAdminPassword(password, passwordHash)) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

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
