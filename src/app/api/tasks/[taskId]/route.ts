import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { withDbTimeout } from "@/lib/db-guard";
import { findTaskConflictsForUser, normalizeTaskStatus, parseTaskDate } from "@/lib/task-service";
import { prisma } from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/validations/task";

async function getOwnedTask(taskId: string, userId: string) {
  return withDbTimeout(
    prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    })
  );
}

export async function PATCH(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { taskId } = await params;
    const existingTask = await getOwnedTask(taskId, user.id);

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const json = await request.json();
    const data = taskUpdateSchema.parse(json);
    const nextDate = data.date ? parseTaskDate(data.date) : existingTask.date;
    const nextStartTime = data.startTime ?? existingTask.startTime;
    const nextEndTime = data.endTime ?? existingTask.endTime;

    if (nextStartTime >= nextEndTime) {
      return NextResponse.json({ error: "End time must be later than start time." }, { status: 400 });
    }

    if (data.date || data.startTime || data.endTime) {
      const conflicts = await findTaskConflictsForUser({
        userId: user.id,
        date: nextDate,
        startTime: nextStartTime,
        endTime: nextEndTime,
        excludeTaskId: taskId
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
    }

    const requestedStatus = data.status ?? existingTask.status;
    const finalStatus =
      requestedStatus === "completed"
        ? "completed"
        : normalizeTaskStatus({
            date: nextDate,
            endTime: nextEndTime,
            status: "pending"
          });

    const task = await withDbTimeout(
      prisma.task.update({
        where: { id: taskId },
        data: {
          ...(data.title ? { title: data.title } : {}),
          ...(data.description !== undefined ? { description: data.description || null } : {}),
          ...(data.date ? { date: nextDate } : {}),
          ...(data.startTime ? { startTime: data.startTime } : {}),
          ...(data.endTime ? { endTime: data.endTime } : {}),
          ...(data.isDaily !== undefined ? { isDaily: data.isDaily } : {}),
          status: finalStatus,
          completedAt: finalStatus === "completed" ? new Date() : null
        }
      })
    );

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Update task failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update task." },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { taskId } = await params;
  const existingTask = await getOwnedTask(taskId, user.id);

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  await withDbTimeout(
    prisma.task.delete({
      where: { id: taskId }
    })
  );

  return NextResponse.json({ message: "Task deleted." });
}
