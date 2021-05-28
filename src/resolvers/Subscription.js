function newLinkSubscribe(parent, args, context, info) {
  return context.pubSub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = { newLink };
