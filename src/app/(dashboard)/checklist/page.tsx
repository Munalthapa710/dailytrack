import { Checklist } from "@/components/tasks/checklist";
import { EmptyState } from "@/components/ui/empty-state";
import { requireSessionUser } from "@/lib/auth";
import { getChecklistTasksForUser } from "@/lib/task-service";

export default async function ChecklistPage() {
  const user = await requireSessionUser();
  const tasks = await getChecklistTasksForUser(user.id);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <p className="eyebrow">Checklist</p>
        <div>
          <h1>Today&apos;s tasks</h1>
          <p>Mark work complete and keep the daily operation moving.</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No checklist items for today" description="Add a new task, or create a daily task that resets every day." />
      ) : (
        <Checklist tasks={tasks} />
      )}
    </div>
  );
}
