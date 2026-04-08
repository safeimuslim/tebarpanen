// src/lib/prisma.ts
import { PrismaClient } from "../../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return databaseUrl;
  }

  try {
    const url = new URL(databaseUrl);
    const sslmode = url.searchParams.get("sslmode");

    if (
      sslmode === "prefer" ||
      sslmode === "require" ||
      sslmode === "verify-ca"
    ) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    return databaseUrl;
  }
}

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
