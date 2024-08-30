export const typeDefs = /* GraphQL */ `
  type Query {
    farmingPools(chain: String!): [FarmingPool!]!
    bestPositions(userPreferences: UserPreferencesInput!): [Position!]!
    balancerPools: [BalancerPool!]!
    balancerPoolDetails(chainId: String!, poolId: String!): BalancerPoolDetails!
    curvePools(blockchainId: String!): [CurvePool!]!
  }

  type FarmingPool {
    id: ID!
    tokenPair: String!
    liquidity: Float!
    apr: Float!
    chain: String!
    tvl: Float!
    riskLevel: RiskLevel!
    protocol: Protocol!
  }

  type LidoAPR {
    timeUnix: Int!
    apr: Float!
    symbol: String!
    address: String!
    chainId: Int!
  }

  extend type Query {
    lidoStEthApr: LidoAPR!
  }

  type Position {
    id: ID!
    poolId: String!
    recommendedAmount: Float!
    estimatedReturns: Float!
    risk: RiskLevel!
  }

  enum RiskLevel {
    LOW
    MEDIUM
    HIGH
  }

  enum Protocol {
    BALANCER
    UNKNOWN
  }

  input UserPreferencesInput {
    riskTolerance: RiskLevel!
    preferredChains: [String!]!
    minLiquidity: Float
    minApr: Float
  }
  type BalancerPool {
    id: ID!
    address: String!
    name: String!
    chain: String!
  }

  type BalancerPoolDetails {
    id: ID!
    address: String!
    name: String!
    chain: String!
    type: String!
    version: Int!
    tokens: [PoolToken!]!
    allTokens: [AllToken!]!
    tvl: Float!
    aprItems: [AprItem!]!
  }

  type PoolToken {
    address: String!
    symbol: String!
    balance: Float!
    hasNestedPool: Boolean!
  }

  type AllToken {
    address: String!
    name: String!
  }

  type AprItem {
    title: String!
    type: String!
    apr: Float!
  }

  type CurvePool {
    id: ID!
    address: String!
    coinsAddresses: [String!]!
    decimals: [String!]!
    virtualPrice: String!
    amplificationCoefficient: String!
    totalSupply: String!
    name: String!
    symbol: String!
    implementation: String!
    assetType: String!
    assetTypeName: String!
    coins: [CurveCoin!]!
    poolUrls: CurvePoolUrls!
    lpTokenAddress: String!
    usdTotal: Float!
    isMetaPool: Boolean!
    usdTotalExcludingBasePool: Float!
    gaugeAddress: String
    gaugeRewards: [GaugeReward!]
    gaugeCrvApy: [Float]
    usesRateOracle: Boolean!
    isBroken: Boolean!
    hasMethods: CurvePoolMethods!
    creationTs: Int!
    creationBlockNumber: Int!
    registryId: String!
    factory: Boolean!
  }

  type CurveCoin {
    address: String!
    usdPrice: Float
    decimals: String!
    isBasePoolLpToken: Boolean!
    symbol: String!
    poolBalance: String!
  }

  type CurvePoolUrls {
    swap: [String!]!
    deposit: [String!]!
    withdraw: [String!]!
  }

  type CurvePoolMethods {
    exchange_received: Boolean!
    exchange_extended: Boolean!
  }

  type GaugeReward {
    gaugeAddress: String!
    tokenPrice: Float!
    name: String!
    symbol: String!
    decimals: String!
    apy: Float!
    metaData: GaugeRewardMetaData!
    tokenAddress: String!
  }

  type GaugeRewardMetaData {
    rate: String!
    periodFinish: Int!
  }

  type CurveVolumes {
    totalVolume: Float!
    poolVolumes: [PoolVolume!]!
  }

  type PoolVolume {
    poolId: ID!
    volume: Float!
  }
`;