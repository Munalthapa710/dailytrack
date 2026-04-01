import { describe, expect, it } from "vitest";
import { decodeSessionToken, signSessionToken } from "@/lib/session-token";

describe("session tokens", () => {
  it("signs and verifies a session payload", async () => {
    const token = await signSessionToken(
      {
        id: "user_123",
        email: "localtest@example.com",
        name: "Local Test"
      },
      "test-secret"
    );

    const payload = await decodeSessionToken(token, "test-secret");

    expect(payload).toEqual({
      id: "user_123",
      email: "localtest@example.com",
      name: "Local Test"
    });
  });

  it("rejects verification with the wrong secret", async () => {
    const token = await signSessionToken(
      {
        id: "user_123",
        email: "localtest@example.com",
        name: "Local Test"
      },
      "correct-secret"
    );

    await expect(decodeSessionToken(token, "wrong-secret")).rejects.toThrow();
  });
});
