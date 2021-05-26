const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const resolvers = {
  Query: {
    info: () => `This is the API of Hackernews`,
    feed: async (parent, args, context) => context.prisma.link.findMany(),
    link: async (parent, args, context) => {
      return context.prisma.link.findUnique({
        where: { id: parseInt(args.id) },
      });
    },
  },

  Mutation: {
    post: (parent, args, context) => {
      const link = context.prisma.link.create({
        data: { url: args.url, description: args.description },
      });
      return link;
    },

    updateLink: async (parent, args, context) => {
      const { id, description, url } = args;
      const updatedLink = await context.prisma.link.update({
        where: { id: parseInt(id) },
        data: { url, description },
      });
      return updatedLink;
    },

    deleteLink: async (parent, args, context) => {
      const { id } = args;
      const linkToDelete = await context.prisma.link.delete({
        where: { id: parseInt(id) },
      });
      return linkToDelete;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { prisma },
});

server
  .listen()
  .then(({ url }) => console.log(`🚀 Server running on ${url} 🚀`));
