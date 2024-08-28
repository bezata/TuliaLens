import {
  Resolvers,
  FarmingPool,
  Position,
  UserPreferencesInput,
  Context,
  RiskLevel,
} from "./types";
import { GraphQLError } from "graphql";

const handleError = (message: string, error: unknown): never => {
  console.error(message, error);
  throw new GraphQLError(message, {
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  });
};

export const resolvers: Resolvers = {
  Query: {
    farmingPools: async (
      _,
      { chain }: { chain: string },
      { prisma }: Context
    ): Promise<FarmingPool[]> => {
      try {
        const pools = await prisma.farmingPool.findMany({ where: { chain } });
        if (pools.length === 0) {
          throw new GraphQLError(`No farming pools found for chain: ${chain}`, {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return pools;
      } catch (error) {
        return handleError(
          `Error fetching farming pools for chain ${chain}:`,
          error
        );
      }
    },
    bestPositions: async (
      _,
      { userPreferences }: { userPreferences: UserPreferencesInput },
      { prisma }: Context
    ): Promise<Position[]> => {
      try {
        const { riskTolerance, preferredChains, minLiquidity, minApr } =
          userPreferences;

        const pools = await prisma.farmingPool.findMany({
          where: {
            chain: { in: preferredChains },
            liquidity: { gte: minLiquidity ?? 0 },
            apr: { gte: minApr ?? 0 },
            riskLevel: riskTolerance as RiskLevel,
          },
          orderBy: { apr: "desc" },
          take: 5,
        });

        const positions: Position[] = pools.map((pool) => ({
          id: pool.id,
          poolId: pool.id,
          recommendedAmount: pool.liquidity * 0.01,
          estimatedReturns: pool.apr,
          risk: pool.riskLevel,
        }));

        if (positions.length === 0) {
          throw new GraphQLError("No suitable positions found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return positions;
      } catch (error) {
        return handleError("Error finding best positions:", error);
      }
    },
  },
  FarmingPool: {
    riskLevel: (parent: FarmingPool): RiskLevel => parent.riskLevel,
  },
  Position: {
    estimatedReturns: async (
      parent: Position,
      _,
      { prisma }: Context
    ): Promise<number> => {
      try {
        const pool = await prisma.farmingPool.findUnique({
          where: { id: parent.poolId },
        });
        if (!pool) {
          throw new GraphQLError(
            `Pool not found for position: ${parent.poolId}`
          );
        }
        return parent.recommendedAmount * pool.apr;
      } catch (error) {
        return handleError(
          `Error calculating estimated returns for position ${parent.id}:`,
          error
        );
      }
    },
  },
};