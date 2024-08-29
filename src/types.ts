import { GraphQLResolveInfo } from "graphql";
import { PrismaClient, Prisma } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  request: Request;
}

// @ts-ignore
export type RiskLevel = Prisma.RiskLevel;
// @ts-ignore
export type Protocol = Prisma.Protocol;

export interface FarmingPool {
  id: string;
  tokenPair: string;
  liquidity: number;
  apr: number;
  chain: string;
  tvl: number;
  riskLevel: RiskLevel;
  protocol: Protocol;
  externalId?: string | null;
}

export interface BalancerPool {
  id: string;
  address: string;
  name: string;
  chain: string;
}

export interface BalancerPoolDetails extends BalancerPool {
  type: string;
  version: number;
  tokens: PoolToken[];
  allTokens: AllToken[];
  tvl: number;
  aprItems: AprItem[];
}

export interface PoolToken {
  address: string;
  symbol: string;
  balance: number;
  hasNestedPool: boolean;
}

export interface AllToken {
  address: string;
  name: string;
}

export interface AprItem {
  title: string;
  type: string;
  apr: number;
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

export type Resolver<TResult, TParent = {}, TContext = Context, TArgs = {}> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export interface Resolvers {
  Query: {
    farmingPools: Resolver<FarmingPool[], {}, Context, { chain: string }>;
    bestPositions: Resolver<
      Position[],
      {},
      Context,
      { userPreferences: UserPreferencesInput }
    >;
    balancerPools: Resolver<BalancerPool[], {}, Context>;
    balancerPoolDetails: Resolver<
      BalancerPoolDetails,
      {},
      Context,
      { chainId: string; poolId: string }
    >;
  };
  FarmingPool: {
    riskLevel: Resolver<RiskLevel, FarmingPool>;
    protocol: Resolver<Protocol, FarmingPool>;
  };
  Position: {
    estimatedReturns: Resolver<number, Position>;
  };
}