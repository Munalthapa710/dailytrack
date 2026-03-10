import { withDbTimeout } from "@/lib/db-guard";
import { hashVerificationToken } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function verifyEmailToken(token: string) {
  const hashedToken = hashVerificationToken(token);

  const user = await withDbTimeout(
    prisma.user.findFirst({
      where: {
        emailVerifyToken: hashedToken,
        emailVerifyExpiry: {
          gt: new Date()
        }
      }
    })
  );

  if (!user) {
    return { ok: false as const, message: "This verification link is invalid or has expired." };
  }

  await withDbTimeout(
    prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null
      }
    })
  );

  return { ok: true as const, message: "Your email has been verified. You can now sign in." };
}
