import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAnalyticsForUser } from "@/lib/task-service";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const analytics = await getAnalyticsForUser(user.id);
  return NextResponse.json(analytics);
}
