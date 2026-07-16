import { NextResponse } from "next/server";
import { databaseUnavailableResponse } from "@/lib/api-errors";
import { withDbTimeout } from "@/lib/db-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await withDbTimeout(prisma.$queryRaw`SELECT 1`, 5000);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Database health check failed", error);
    return databaseUnavailableResponse();
  }
}
