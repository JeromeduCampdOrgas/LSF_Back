const JWT = require("jsonwebtoken");
const config = require("../config/config");

function issueJWT(user) {
  // on génére le token
  const id = user.id;
  const expiresIn = "24H";
  const payload = {
    userId: userData.id,
    email: userData.email,
    isAdmin: userData.isAdmin,
    username: userData.username,
  };

  const signedToken = JWT.sign(payload, "JWT_SIGN_SECRET", {
    expiresIn: expiresIn,
  });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}
function getUserId(req) {
  // on vérifie le userId du token
  const token = req.headers.authorization.split(" ")[1]; // on récupère le token de la requête entrante
  const decodedToken = JWT.verify(token, "JWT_SIGN_SECRET"); // on le vérifie
  console.log(decodedToken);
  const userId = decodedToken.id;
  return userId; // on récupère l'id du token
}

module.exports.issueJWT = issueJWT;
module.exports.getUserId = getUserId;
