import {
  Resolvers,
  FarmingPool,
  Position,
  UserPreferencesInput,
  Context,
} from "./types";
import { GraphQLError } from "graphql";

export const resolvers: Resolvers = {
  Query: {
    farmingPools: async (_, { chain }, { prisma }: Context) => {
      try {
        const pools = await prisma.farmingPool.findMany({ where: { chain } });
        if (pools.length === 0) {
          throw new GraphQLError(`No farming pools found for chain: ${chain}`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return pools;
      } catch (error) {
        console.error(
          `Error fetching farming pools for chain ${chain}:`,
          error
        );
        throw new GraphQLError("Failed to fetch farming pools", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    bestPositions: async (_, { userPreferences }, { prisma }: Context) => {
      try {
        const { riskTolerance, preferredChains, minLiquidity, minApr } =
          userPreferences;

        const pools = await prisma.farmingPool.findMany({
          where: {
            chain: { in: preferredChains },
            liquidity: { gte: minLiquidity || 0 },
            apr: { gte: minApr || 0 },
            riskLevel: riskTolerance,
          },
          orderBy: { apr: "desc" },
          take: 5,
        });

        const positions = pools.map(
          (pool: FarmingPool): Position => ({
            id: pool.id,
            poolId: pool.id,
            recommendedAmount: pool.liquidity * 0.01,
            estimatedReturns: pool.apr,
            risk: pool.riskLevel,
          })
        );

        if (positions.length === 0) {
          throw new GraphQLError("No suitable positions found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return positions;
      } catch (error) {
        console.error("Error finding best positions:", error);
        throw new GraphQLError("Failed to find best positions", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  FarmingPool: {
    riskLevel: (parent: FarmingPool) => parent.riskLevel,
  },
  Position: {
    estimatedReturns: async (parent: Position, _, { prisma }: Context) => {
      const pool = await prisma.farmingPool.findUnique({
        where: { id: parent.poolId },
      });
      if (!pool) {
        throw new GraphQLError(`Pool not found for position: ${parent.poolId}`);
      }
      return parent.recommendedAmount * pool.apr;
    },
  },
};
