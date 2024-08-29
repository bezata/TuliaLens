export const typeDefs = /* GraphQL */ `
  type Query {
    farmingPools(chain: String!): [FarmingPool!]!
    bestPositions(userPreferences: UserPreferencesInput!): [Position!]!
    balancerPools: [BalancerPool!]!
    balancerPoolDetails(chainId: String!, poolId: String!): BalancerPoolDetails!
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
    externalId: String
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
    tokens: [Token!]!
    tvl: Float!
    apr: Float!
  }

  type Token {
    address: String!
    symbol: String!
    balance: Float!
  }
`;