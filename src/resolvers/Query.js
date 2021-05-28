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

  const linkList = await context.prisma.link.findMany({ where, take, skip });

  return linkList;
}

module.exports = {
  feed,
};
