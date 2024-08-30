import { GraphQLResolveInfo } from "graphql";
import { PrismaClient, Prisma } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  request: Request;
}

export type RiskLevel = Prisma.RiskLevel;
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

export interface CurvePool {
  id: string;
  address: string;
  coinsAddresses: string[];
  decimals: string[];
  virtualPrice: string;
  amplificationCoefficient: string;
  totalSupply: string;
  name: string;
  symbol: string;
  implementation: string;
  assetType: string;
  assetTypeName: string;
  coins: CurveCoin[];
  poolUrls: {
    swap: string[];
    deposit: string[];
    withdraw: string[];
  };
  lpTokenAddress: string;
  usdTotal: number;
  isMetaPool: boolean;
  usdTotalExcludingBasePool: number;
  gaugeAddress?: string;
  gaugeRewards?: GaugeReward[];
  gaugeCrvApy?: (number | null)[];
  usesRateOracle: boolean;
  isBroken: boolean;
  hasMethods: {
    exchange_received: boolean;
    exchange_extended: boolean;
  };
  creationTs: number;
  creationBlockNumber: number;
  blockchainId: string;
  registryId: string;
  factory: boolean;
}

export interface CurveCoin {
  address: string;
  usdPrice: number | null;
  decimals: string;
  isBasePoolLpToken: boolean;
  symbol: string;
  poolBalance: string;
}

export interface GaugeReward {
  gaugeAddress: string;
  tokenPrice: number;
  name: string;
  symbol: string;
  decimals: string;
  apy: number;
  metaData: {
    rate: string;
    periodFinish: number;
  };
  tokenAddress: string;
}

export interface CurveApiResponse {
  success: boolean;
  data: {
    poolData: CurvePool[];
  };
}

export interface LidoAPR {
  timeUnix: number;
  apr: number;
  symbol: string;
  address: string;
  chainId: number;
}

export interface CurvePoolDetails {
  id: string;
  name: string;
  address: string;
  coins: string[];
  coinNames: string[];
  coinDecimals: number[];
  underlyingCoins: string[];
  underlyingCoinNames: string[];
  underlyingCoinDecimals: number[];
  totalSupply: string;
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
    curvePools: Resolver<CurvePool[], {}, Context, { blockchainId: string }>;
    lidoStEthApr: Resolver<LidoAPR, {}, Context>;
  };
  FarmingPool: {
    riskLevel: Resolver<RiskLevel, FarmingPool>;
    protocol: Resolver<Protocol, FarmingPool>;
  };
  Position: {
    estimatedReturns: Resolver<number, Position>;
  };
}