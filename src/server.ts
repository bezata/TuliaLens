import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { resolve } from "path";
import { resolvers } from "./resolvers";
import { config } from "./config";
import { db } from "./db";
import { Context } from "./types";

const typeDefs = readFileSync(resolve(__dirname, "schema.graphql"), "utf-8");

const apollo = new ApolloServer<Context>({
  typeDefs,
  resolvers: resolvers as any,
});

await apollo.start();

const app = new Elysia()
  .use(swagger())
  .get("/", () => "TuliaLens API")
  .post("/graphql", async ({ request }: { request: any }) => {
    const { body } = await request.json();
    return apollo.executeOperation(body, {
      contextValue: { db },
    });
  })
  .get(
    "/graphql",
    () => `
    <html>
      <body>
        <h1>TuliaLens GraphQL API</h1>
        <p>Send POST requests to this endpoint to execute GraphQL queries.</p>
      </body>
    </html>
  `
  )
  .listen(config.PORT);

console.log(
  `🚀 TuliaLens API ready at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Swagger UI available at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
