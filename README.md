# TuliaLens API

TuliaLens is a GraphQL API built with Bun, Elysia, and Apollo Server. It provides information about farming pools across various blockchain networks and helps users find the best positions based on their preferences.

## Features

- Fetch farming pools for specific blockchain networks
- Get best positions based on user preferences
- Risk level assessment for farming pools
- Mock data for testing and development

## Prerequisites

- [Bun](https://bun.sh/) (latest version)

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

3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=4000
   DATABASE_URL=mongodb://localhost:27017/tulialens
   ```

4. Start the server:
   ```
   bun --watch run src/server.ts
   ```

The server will start, and you should see output indicating the API is ready.

## API Documentation

After starting the server, you can access the Swagger UI documentation at:

```
http://localhost:4000/swagger
```

This provides an interactive interface to explore and test the API endpoints.

## GraphQL Endpoint

The GraphQL endpoint is available at:

```
http://localhost:4000/graphql
```

You can use tools like [GraphQL Playground](https://github.com/graphql/graphql-playground) or [Postman](https://www.postman.com/) to interact with this endpoint.

## Sample Queries

Here are some sample GraphQL queries you can try:

1. Fetch farming pools for Ethereum:

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
    poolId
    recommendedAmount
    estimatedReturns
    risk
  }
}
```

## Project Structure

- `src/server.ts`: Main entry point of the application
- `src/resolvers.ts`: GraphQL resolvers
- `src/db.ts`: Mock database and data access methods
- `src/types.ts`: TypeScript type definitions
- `src/config.ts`: Configuration management
- `schema.graphql`: GraphQL schema definition

## Development

During development, you can use the `--watch` flag to automatically restart the server when files change:

```
bun --watch run src/server.ts
```

## Testing

(Note: Add information about running tests once you've set up a testing framework)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.