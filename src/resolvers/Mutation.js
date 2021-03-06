const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserIdFrom } = require("../utils/authorization");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) throw new Error("User does not exit");

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
}

async function post(parent, args, context) {
  const { userId } = context;
  const newLink = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubSub.publish("NEW_LINK", newLink);

  return newLink;
}

async function updateLink(parent, args, context) {
  const { id, description, url } = args;
  const { userId } = context;
  if (!userId) throw new Error("Unauthorized");

  const link = await context.prisma.link.findUnique({
    where: { id: parseInt(id) },
  });

  if (link.userId !== userId) throw new Error("Unauthorized");

  const updatedLink = await context.prisma.link.update({
    where: { id: parseInt(id) },
    data: { url, description },
  });
  return updatedLink;
}

async function deleteLink(parent, args, context) {
  const { id } = args;
  const { userId } = context;
  if (!userId) throw new Error("Unauthorized");

  const link = await context.prisma.link.findUnique({
    where: { id: parseInt(id) },
  });

  if (link.userId !== userId) throw new Error("Unauthorized");

  const linkToDelete = await context.prisma.link.delete({
    where: { id: parseInt(id) },
  });
  return linkToDelete;
}

async function vote(parent, args, context, info) {
  const { userId } = context;
  const { linkId } = args;
  if (!userId) throw new Error("Unauthorized");

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(linkId),
        userId: Number(userId),
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: Number(userId) } },
      link: { connect: { id: Number(linkId) } },
    },
  });

  context.pubSub.publish("NEW_VOTE", newVote);

  return newVote;
}
module.exports = { signup, login, post, updateLink, deleteLink, vote };
