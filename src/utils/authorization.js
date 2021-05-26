const jwt = require("jsonwebtoken");
const APP_SECRET = "I know this is not secure, this project is only a poc";

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserIdFrom(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) throw new Error("Token not found");
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  getUserIdFrom,
  APP_SECRET,
};
