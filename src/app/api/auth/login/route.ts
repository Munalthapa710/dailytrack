import { NextResponse } from "next/server";
import { comparePassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { withDbTimeout } from "@/lib/db-guard";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = loginSchema.parse(json);

    const user = await withDbTimeout(
      prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      })
    );

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: "Verify your email before signing in." }, { status: 403 });
    }

    const matches = await comparePassword(data.password, user.passwordHash);
    if (!matches) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken(user);
    await setSessionCookie(token);

    return NextResponse.json({ message: "Login successful." });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to log in right now." },
      { status: 400 }
    );
  }
}
