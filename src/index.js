const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");
const { getUserIdFrom } = require("./utils/authorization");

const pubSub = new PubSub();

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
  Vote,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubSub,
      userId: req && req.headers.authorization ? getUserIdFrom(req) : null,
    };
  },
});

server
  .listen()
  .then(({ url }) => console.log(`🚀 Server running on ${url} 🚀`));
