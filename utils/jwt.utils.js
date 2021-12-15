//Imports
const jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "<JWT_SIGN_TOKEN>";

// Exported functions
module.exports = {
  generateTokenForUser: function (userData) {
    return jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        isAdmin: userData.isAdmin,
        username: userData.username,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: "24h",
      }
    );
  },
  parseAuthorization: function (authorization) {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  getUserId: function (authorization) {
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {}
    }
    return userId;
  },
};
