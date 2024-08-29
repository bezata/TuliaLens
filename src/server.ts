import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { yoga } from "@elysiajs/graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import { config } from "./config";
import { Context } from "./types";

const prisma = new PrismaClient();

const app = new Elysia()
  .use(cors())
  .use(
    yoga({
      typeDefs,
      resolvers,
      context: ({ request }: { request: Request }): Context => ({
        prisma,
        request,
      }),
    } as any)
  )
  .listen(config.PORT);

console.log(
  `🚀 GraphQL API ready at http://${app.server?.hostname}:${app.server?.port}/graphql`
);

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});