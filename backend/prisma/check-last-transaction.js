// Read-only check. Prints the 3 latest transactions so you see exactly what the API saved.
// Run: node prisma/check-last-transaction.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      status: true,
      itemAmount: true,
      platformFee: true,
      totalAmount: true,
      providerSubaccount: true,
      inspectionAcceptedAt: true,
      paidAt: true,
      createdAt: true,
    },
  });
  for (const r of rows) {
    console.log(
      JSON.stringify(
        {
          id: r.id,
          status: r.status,
          itemNaira: r.itemAmount / 100,
          commissionNaira: r.platformFee / 100,
          buyerPaysNaira: r.totalAmount / 100,
          inspectionTick: !!r.inspectionAcceptedAt,
          paidAt: r.paidAt,
          createdAt: r.createdAt,
        },
        null,
        2
      )
    );
  }
  if (rows.length === 0) console.log("No transactions yet.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
