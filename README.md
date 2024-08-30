# TuliaLens API

TuliaLens is a GraphQL API for managing farming pools and finding the best positions based on user preferences.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- PostgreSQL database

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tulialens.git
   cd tulialens
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up your `.env` file with your PostgreSQL database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/tulialens?schema=public"
   ```

4. Generate Prisma client and push the schema to your database:
   ```
   bun run prisma:generate
   bun run prisma:push
   ```

5. Seed the database with initial data:
   ```
   bun run prisma:seed
   ```

6. Start the server:
   ```
   bun run dev
   ```

The server will start, and you can access the GraphQL playground at `http://localhost:3000/graphql`.

## Available Scripts

- `bun run start`: Start the server
- `bun run dev`: Start the server in development mode with hot reloading
- `bun run prisma:generate`: Generate Prisma client
- `bun run prisma:push`: Push schema changes to the database
- `bun run prisma:seed`: Seed the database with initial data

## GraphQL Queries

1. Fetch farming pools for a specific chain:
   ```graphql
   query {
     farmingPools(chain: "ethereum") {
       id
       tokenPair
       liquidity
       apr
       tvl
       riskLevel
     }
   }
   ```

2. Get best positions based on user preferences:
   ```graphql
   query {
     bestPositions(userPreferences: {
       riskTolerance: MEDIUM
       preferredChains: ["ethereum", "bitcoin"]
       minLiquidity: 500000
       minApr: 0.05
     }) {
       id
       poolId
       recommendedAmount
       estimatedReturns
       risk
     }
   }
   ```

   # GraphQL API Documentation

## Types

### Query
- `farmingPools(chain: String!): [FarmingPool!]!`
- `bestPositions(userPreferences: UserPreferencesInput!): [Position!]!`
- `balancerPools: [BalancerPool!]!`
- `balancerPoolDetails(chainId: String!, poolId: String!): BalancerPoolDetails!`
- `curvePools(blockchainId: String!): [CurvePool!]!`

### FarmingPool
- `id: ID!`
- `tokenPair: String!`
- `liquidity: Float!`
- `apr: Float!`
- `chain: String!`
- `tvl: Float!`
- `riskLevel: RiskLevel!`
- `protocol: Protocol!`

### Position
- `id: ID!`
- `poolId: String!`
- `recommendedAmount: Float!`
- `estimatedReturns: Float!`
- `risk: RiskLevel!`

### BalancerPool
- `id: ID!`
- `address: String!`
- `name: String!`
- `chain: String!`

### BalancerPoolDetails
Extends BalancerPool with:
- `type: String!`
- `version: Int!`
- `tokens: [PoolToken!]!`
- `allTokens: [AllToken!]!`
- `tvl: Float!`
- `aprItems: [AprItem!]!`

### CurvePool
- `id: ID!`
- `address: String!`
- `coinsAddresses: [String!]!`
- `decimals: [String!]!`
- `virtualPrice: String!`
- `amplificationCoefficient: String!`
- `totalSupply: String!`
- `name: String!`
- `symbol: String!`
- `implementation: String!`
- `assetType: String!`
- `assetTypeName: String!`
- `coins: [CurveCoin!]!`
- `poolUrls: CurvePoolUrls!`
- `lpTokenAddress: String!`
- `usdTotal: Float!`
- `isMetaPool: Boolean!`
- `usdTotalExcludingBasePool: Float!`
- `gaugeAddress: String`
- `gaugeRewards: [GaugeReward!]`
- `gaugeCrvApy: [Float]`
- `usesRateOracle: Boolean!`
- `isBroken: Boolean!`
- `hasMethods: CurvePoolMethods!`
- `creationTs: Int!`
- `creationBlockNumber: Int!`
- `registryId: String!`
- `factory: Boolean!`

## Enums

### RiskLevel
- `LOW`
- `MEDIUM`
- `HIGH`

### Protocol
- `BALANCER`
- `UNKNOWN`

## Inputs

### UserPreferencesInput
- `riskTolerance: RiskLevel!`
- `preferredChains: [String!]!`
- `minLiquidity: Float`
- `minApr: Float`

## Queries

### farmingPools
Retrieves farming pools for a specific blockchain.

**Arguments:**
- `chain: String!`: The blockchain to query farming pools for.

**Returns:** `[FarmingPool!]!`

### bestPositions
Recommends the best positions based on user preferences.

**Arguments:**
- `userPreferences: UserPreferencesInput!`: User's investment preferences.

**Returns:** `[Position!]!`

### balancerPools
Retrieves all Balancer pools.

**Returns:** `[BalancerPool!]!`

### balancerPoolDetails
Retrieves detailed information about a specific Balancer pool.

**Arguments:**
- `chainId: String!`: The blockchain ID.
- `poolId: String!`: The pool ID.

**Returns:** `BalancerPoolDetails!`

### curvePools
Retrieves all Curve pools for a specific blockchain.

**Arguments:**
- `blockchainId: String!`: The blockchain ID.

**Returns:** `[CurvePool!]!`

## Error Handling

The API uses GraphQL errors with appropriate error codes:

- `NOT_FOUND`: When requested resources are not found.
- `INTERNAL_SERVER_ERROR`: For unexpected server errors.

## Notes

- The `estimatedReturns` field in the `Position` type is calculated based on the `recommendedAmount` and the APR of the associated farming pool.
- The API integrates with external services for Balancer and Curve data.
- Error handling is implemented to provide meaningful error messages and appropriate error codes.

## License

This project is licensed under the MIT License.