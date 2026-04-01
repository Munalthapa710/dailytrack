import { describe, expect, it } from "vitest";
import { taskSchema, taskUpdateSchema } from "@/lib/validations/task";

describe("task validation", () => {
  it("accepts a valid task payload", () => {
    const result = taskSchema.safeParse({
      title: "Plan sprint review",
      description: "Outline talking points",
      startTime: "09:00",
      endTime: "10:00",
      isDaily: false
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid time range", () => {
    const result = taskSchema.safeParse({
      title: "Plan sprint review",
      description: "Outline talking points",
      startTime: "11:00",
      endTime: "10:00"
    });

    expect(result.success).toBe(false);
  });

  it("allows partial task updates when only one time field is provided", () => {
    const result = taskUpdateSchema.safeParse({
      endTime: "16:00"
    });

    expect(result.success).toBe(true);
  });
});
