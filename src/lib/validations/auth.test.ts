import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

describe("auth validation", () => {
  it("accepts a strong registration password", () => {
    const result = registerSchema.safeParse({
      name: "Local Test",
      email: "localtest@example.com",
      password: "StrongPass1"
    });

    expect(result.success).toBe(true);
  });

  it("rejects a weak registration password", () => {
    const result = registerSchema.safeParse({
      name: "Local Test",
      email: "localtest@example.com",
      password: "weakpass"
    });

    expect(result.success).toBe(false);
  });

  it("requires a non-empty login password", () => {
    const result = loginSchema.safeParse({
      email: "localtest@example.com",
      password: ""
    });

    expect(result.success).toBe(false);
  });
});
