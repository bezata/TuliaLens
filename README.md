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

## License

This project is licensed under the MIT License.