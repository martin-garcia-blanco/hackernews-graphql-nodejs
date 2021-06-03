async function feed(parent, args, context, info) {
  const { filter, skip, take } = args;

  const where = filter
    ? {
        OR: [
          { url: { contains: filter } },
          { description: { contains: filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({ where, take, skip });
  const count = await context.prisma.link.count({ where });
  const feed = {
    links,
    count,
  };

  return feed;
}

module.exports = {
  feed,
};
