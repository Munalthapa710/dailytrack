export type TaskStatus = "pending" | "completed" | "missed";

export type FilterKey =
  | "today"
  | "week"
  | "month"
  | "completed"
  | "pending"
  | "missed"
  | "all";

export interface ChartDatum {
  label: string;
  completed: number;
  pending: number;
  missed: number;
}

export interface DailyBriefingItem {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  isDaily: boolean;
  phase: "done" | "now" | "up-next" | "later" | "missed";
}

export interface DailyBriefing {
  dateLabel: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  completionRate: number;
  scheduledMinutes: number;
  completedMinutes: number;
  nextTask: DailyBriefingItem | null;
  currentTask: DailyBriefingItem | null;
  items: DailyBriefingItem[];
}
