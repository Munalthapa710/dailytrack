import { NextResponse } from "next/server";

export function isDatabaseConnectionError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("Can't reach database server") ||
    error.message.includes("Database request timed out") ||
    error.message.includes("P1001")
  );
}

export function databaseUnavailableResponse() {
  return NextResponse.json(
    {
      error: "Database is unavailable. Check the Render PostgreSQL service and DATABASE_URL."
    },
    { status: 503 }
  );
}
