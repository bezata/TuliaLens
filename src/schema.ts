export const typeDefs = /* GraphQL */ `
  type Query {
    farmingPools(chain: String!): [FarmingPool!]!
    bestPositions(userPreferences: UserPreferencesInput!): [Position!]!
  }

  type FarmingPool {
    id: ID!
    tokenPair: String!
    liquidity: Float!
    apr: Float!
    chain: String!
    tvl: Float!
    riskLevel: RiskLevel!
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

  input UserPreferencesInput {
    riskTolerance: RiskLevel!
    preferredChains: [String!]!
    minLiquidity: Float
    minApr: Float
  }
`;
