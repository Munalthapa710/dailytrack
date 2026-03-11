import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { withDbTimeout } from "@/lib/db-guard";
import { findTaskConflictsForUser, getTasksForUser, normalizeTaskStatus, parseTaskDate } from "@/lib/task-service";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validations/task";
import { FilterKey } from "@/types";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const filter = (searchParams.get("filter") as FilterKey) ?? "all";
  const tasks = await getTasksForUser(user.id, filter);
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const json = await request.json();
    const data = taskSchema.parse(json);
    const parsedDate = parseTaskDate(data.date);
    const conflicts = await findTaskConflictsForUser({
      userId: user.id,
      date: parsedDate,
      startTime: data.startTime,
      endTime: data.endTime
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: "This time overlaps with another task.",
          conflicts
        },
        { status: 409 }
      );
    }

    const status =
      data.status && data.status !== "missed"
        ? data.status
        : normalizeTaskStatus({
            date: parsedDate,
            endTime: data.endTime,
            status: "pending"
          });

    const task = await withDbTimeout(
      prisma.task.create({
        data: {
          title: data.title,
          description: data.description || null,
          date: parsedDate,
          startTime: data.startTime,
          endTime: data.endTime,
          isDaily: data.isDaily ?? false,
          status,
          completedAt: status === "completed" ? new Date() : null,
          userId: user.id
        }
      })
    );

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create task failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create task." },
      { status: 400 }
    );
  }
}
