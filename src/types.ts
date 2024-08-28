import { GraphQLResolveInfo } from "graphql";
import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  request: Request;
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface FarmingPool {
  id: string;
  tokenPair: string;
  liquidity: number;
  apr: number;
  chain: string;
  tvl: number;
  riskLevel: RiskLevel;
}

export interface Position {
  id: string;
  poolId: string;
  recommendedAmount: number;
  estimatedReturns: number;
  risk: RiskLevel;
}

export interface UserPreferencesInput {
  riskTolerance: RiskLevel;
  preferredChains: string[];
  minLiquidity?: number;
  minApr?: number;
}

export type Resolver<
  TResult,
  TParent = {},
  TContext = Context,
  TArgs = { [argName: string]: any }
> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolvers = {
  Query: {
    farmingPools: Resolver<FarmingPool[], {}, Context, { chain: string }>;
    bestPositions: Resolver<
      Position[],
      {},
      Context,
      { userPreferences: UserPreferencesInput }
    >;
  };
  FarmingPool: {
    riskLevel: Resolver<RiskLevel, FarmingPool, Context>;
  };
  Position: {
    estimatedReturns: Resolver<number, Position, Context>;
  };
};