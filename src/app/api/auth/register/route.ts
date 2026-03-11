import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { withDbTimeout } from "@/lib/db-guard";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = registerSchema.parse(json);

    const existingUser = await withDbTimeout(
      prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      })
    );

    if (existingUser) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    await withDbTimeout(
      prisma.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          passwordHash: await hashPassword(data.password),
          emailVerified: true
        }
      })
    );

    return NextResponse.json({ message: "Registration successful. You can now sign in." }, { status: 201 });
  } catch (error) {
    console.error("Register failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register right now." },
      { status: 400 }
    );
  }
}
