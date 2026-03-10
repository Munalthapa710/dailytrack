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
