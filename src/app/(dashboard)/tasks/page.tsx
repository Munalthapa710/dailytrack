import { TasksWorkspace } from "@/components/tasks/tasks-workspace";
import { requireSessionUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/task-service";
import { FilterKey } from "@/types";

export default async function TasksPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: FilterKey }>;
}) {
  const user = await requireSessionUser();
  const params = await searchParams;
  const filter = params.filter ?? "all";
  const tasks = await getTasksForUser(user.id, filter);

  return <TasksWorkspace initialTasks={tasks} filter={filter} />;
}
