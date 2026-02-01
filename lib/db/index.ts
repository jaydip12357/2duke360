import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  // Only create client if DATABASE_URL is set and not a placeholder
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("placeholder")) {
    console.warn("DATABASE_URL not set or is placeholder, database features will be unavailable");
    return null;
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
