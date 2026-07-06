// Seeds the Maple Court demo estate (PRD §13). Run with `npx prisma db seed`
// (loads .env) or `npm run db:seed`.
import { seedDemoEstate } from "../src/lib/server/seed-data";
import { prisma } from "../src/lib/server/db";

async function main() {
  const { estateId, userId } = await seedDemoEstate();
  console.log(`Seeded Maple Court estate ${estateId} (treasurer ${userId}).`);
  console.log("Login: treasurer@maplecourt.ng / password");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
