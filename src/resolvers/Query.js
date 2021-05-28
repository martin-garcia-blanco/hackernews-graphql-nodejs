async function feed(parent, args, context, info) {
  const { filter } = args;
  const linkList = await context.prisma.link.findMany();

  if (Boolean(filter)) {
    const newList = linkList.filter(
      (link) => link.url.includes(filter) || link.description.includes(filter)
    );
    return newList;
  }

  return linkList;
}

module.exports = {
  feed,
};
