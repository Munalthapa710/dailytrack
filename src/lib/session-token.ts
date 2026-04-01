import { SignJWT, jwtVerify } from "jose";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

const encoder = new TextEncoder();

function getSecretBytes(secret: string) {
  return encoder.encode(secret);
}

export async function signSessionToken(user: SessionUser, secret: string) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretBytes(secret));
}

export async function decodeSessionToken(token: string, secret: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, getSecretBytes(secret));

  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string
  };
}
