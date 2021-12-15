const express = require("express");
const router = express.Router();
//const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signupbis);
//router.post("/users/login/", userCtrl.login);
//router.get("/users/me/", auth, userCtrl.getUserProfile);
//router.put("/users/me/", auth, userCtrl.updateUserProfile);
//router.post("/users/me/delete", auth, userCtrl.deleteUserProfil);
//router.get("/users", userCtrl.getUsers);

module.exports = router;
