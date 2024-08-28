import { GraphQLResolveInfo } from "graphql";

export interface Context {
  db: Database;
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

export interface Database {
  connect(): Promise<void>;
  getFarmingPools(chain: string): Promise<FarmingPool[]>;
  getBestPositions(userPreferences: UserPreferencesInput): Promise<Position[]>;
  getFarmingPoolById(id: string): Promise<FarmingPool | null>;
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ((
      parent: TParent,
      args: TArgs,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult)
  | {
      fragment: string;
      resolve: (
        parent: TParent,
        args: TArgs,
        context: TContext,
        info: GraphQLResolveInfo
      ) => Promise<TResult> | TResult;
    };

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
