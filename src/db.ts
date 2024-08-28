import {
  FarmingPool,
  Position,
  UserPreferencesInput,
  RiskLevel,
} from "./types";

const mockFarmingPools: FarmingPool[] = [
  {
    id: "1",
    tokenPair: "ETH-USDT",
    liquidity: 1000000,
    apr: 0.05,
    chain: "ethereum",
    tvl: 5000000,
    riskLevel: RiskLevel.LOW,
  },
  {
    id: "2",
    tokenPair: "BTC-USDC",
    liquidity: 2000000,
    apr: 0.08,
    chain: "bitcoin",
    tvl: 10000000,
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    id: "3",
    tokenPair: "BNB-BUSD",
    liquidity: 500000,
    apr: 0.12,
    chain: "binance",
    tvl: 2500000,
    riskLevel: RiskLevel.HIGH,
  },
  {
    id: "4",
    tokenPair: "ETH-DAI",
    liquidity: 750000,
    apr: 0.06,
    chain: "ethereum",
    tvl: 3750000,
    riskLevel: RiskLevel.MEDIUM,
  },
  {
    id: "5",
    tokenPair: "MATIC-USDT",
    liquidity: 300000,
    apr: 0.15,
    chain: "polygon",
    tvl: 1500000,
    riskLevel: RiskLevel.HIGH,
  },
];

class Database {
  async connect(): Promise<void> {
    console.log("Mock database connected");
  }

  async getFarmingPools(chain: string): Promise<FarmingPool[]> {
    return mockFarmingPools.filter((pool) => pool.chain === chain);
  }

  async getBestPositions(
    userPreferences: UserPreferencesInput
  ): Promise<Position[]> {
    const { riskTolerance, preferredChains, minLiquidity, minApr } =
      userPreferences;

    let filteredPools = mockFarmingPools.filter(
      (pool) =>
        preferredChains.includes(pool.chain) &&
        (minLiquidity ? pool.liquidity >= minLiquidity : true) &&
        (minApr ? pool.apr >= minApr : true)
    );

    // Sort pools by APR in descending order
    filteredPools.sort((a, b) => b.apr - a.apr);

    // Take top 5 pools and convert to positions
    return filteredPools.slice(0, 5).map((pool) => ({
      poolId: pool.id,
      recommendedAmount: pool.liquidity * 0.01, // Recommend 1% of pool liquidity
      estimatedReturns: pool.apr,
      risk: pool.riskLevel,
    }));
  }

  async getFarmingPoolById(id: string): Promise<FarmingPool | null> {
    return mockFarmingPools.find((pool) => pool.id === id) || null;
  }
}

export const db = new Database();
