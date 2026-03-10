import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/tasks/filter-bar";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { requireUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/task-service";
import { FilterKey } from "@/types";

export default async function TasksPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: FilterKey }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const filter = params.filter ?? "all";
  const tasks = await getTasksForUser(user.id, filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Tasks</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Add and manage tasks</h2>
        </div>
        <TaskFormDialog mode="create" />
      </div>

      <FilterBar />

      {tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Create a task or switch filters to see your scheduled work." />
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}
