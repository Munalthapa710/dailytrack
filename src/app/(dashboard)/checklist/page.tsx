import { Checklist } from "@/components/tasks/checklist";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/lib/auth";
import { getChecklistTasksForUser } from "@/lib/task-service";

export default async function ChecklistPage() {
  const user = await requireUser();
  const tasks = await getChecklistTasksForUser(user.id);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Checklist</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Today&apos;s tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No checklist items for today" description="Add a new task, or create a daily task that resets every day." />
      ) : (
        <Checklist tasks={tasks} />
      )}
    </div>
  );
}
