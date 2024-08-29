import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.farmingPool.createMany({
    data: [
      {
        tokenPair: "ETH-USDT",
        liquidity: 1000000,
        apr: 0.05,
        chain: "ethereum",
        tvl: 5000000,
        riskLevel: "LOW",
        // @ts-ignore
        protocol: "BALANCER",
      },
      {
        tokenPair: "BTC-USDC",
        liquidity: 2000000,
        apr: 0.08,
        chain: "bitcoin",
        tvl: 10000000,
        riskLevel: "MEDIUM",
        // @ts-ignore
        protocol: "BALANCER",
      },
      {
        tokenPair: "BNB-BUSD",
        liquidity: 500000,
        apr: 0.12,
        chain: "binance",
        tvl: 2500000,
        riskLevel: "HIGH",
        // @ts-ignore
        protocol: "BALANCER",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// To run this script with Bun, use:
// bun run seed.ts