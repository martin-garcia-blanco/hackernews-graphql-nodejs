const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of Hackernews`,
    feed: () => links,
    link: (parent, args) => links.find((item) => args.id === item.id),
  },

  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },

    updateLink: (parent, args) => {
      const { id, description, url } = args;
      const link = links.find((item) => id === item.id);
      if (!link) return null;
      if (description) link.description = description;
      if (url) link.url = url;
      return link;
    },

    deleteLink: (parent, args) => {
      const { id } = args;
      const linkToDelete = links.find((item) => item.id === id);
      links = links.filter((item) => item.id !== id);
      return linkToDelete;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`🚀 Server running on ${url} 🚀`));
