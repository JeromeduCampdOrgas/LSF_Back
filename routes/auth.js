const express = require("express");
const router = express.Router();

// Appel des middelwares Auth (token) et Multer (images)
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Appel des controllers
const authCtrl = require("../controllers/auth");

// Routage des controleurs
router.post("/register", multer, authCtrl.signup);
//router.post("/login", authCtrl.login);
//router.get("/logout", auth, authCtrl.logout);

module.exports = router;
