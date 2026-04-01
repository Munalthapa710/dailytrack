export async function withDbTimeout<T>(operation: Promise<T>, timeoutMs = 2000): Promise<T> {
  return Promise.race([
    operation,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Database request timed out. Check your database connection."));
      }, timeoutMs);
    })
  ]);
}
