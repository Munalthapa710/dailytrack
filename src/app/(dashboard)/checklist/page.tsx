import { Checklist } from "@/components/tasks/checklist";
import { EmptyState } from "@/components/ui/empty-state";
import { requireSessionUser } from "@/lib/auth";
import { getChecklistTasksForUser } from "@/lib/task-service";

export default async function ChecklistPage() {
  const user = await requireSessionUser();
  const tasks = await getChecklistTasksForUser(user.id);

  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <p className="eyebrow">Checklist</p>
        <h2 className="title-display mt-3 text-4xl">Today&apos;s tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No checklist items for today" description="Add a new task, or create a daily task that resets every day." />
      ) : (
        <Checklist tasks={tasks} />
      )}
    </div>
  );
}
