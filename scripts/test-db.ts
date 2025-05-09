import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const progress = await prisma.progress.findMany();
  console.log("Progresos:", progress);
}

main().finally(() => prisma.$disconnect());
