import {
  Resolvers,
  FarmingPool,
  Position,
  UserPreferencesInput,
  RiskLevel,
} from "./types";
import { GraphQLError } from "graphql";

export const resolvers: Resolvers = {
  Query: {
    farmingPools: async (_, { chain }, { db }) => {
      try {
        const pools = await db.getFarmingPools(chain);
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
    bestPositions: async (_, { userPreferences }, { db }) => {
      try {
        const positions = await db.getBestPositions(userPreferences);
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
    estimatedReturns: async (parent: Position, _, { db }) => {
      const pool = await db.getFarmingPoolById(parent.poolId);
      if (!pool)
        throw new GraphQLError(`Pool not found for position: ${parent.poolId}`);
      return parent.recommendedAmount * pool.apr;
    },
  },
};
