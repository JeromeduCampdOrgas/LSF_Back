const router = require("express").Router();
const userCtrl = require("../controllers/user");
const authUser = require("../middleware/authUser");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/signup", userCtrl.signup); //authUser.checkUsername, authUser.valid,
router.post("/login", authUser.valid, userCtrl.login);
router.get("/users", auth, userCtrl.getAllUsers);
router.put("/users/:id", auth, multer, userCtrl.updateAccount);
router.get("/users/:id", auth, userCtrl.getAccount);
router.delete("/users/:id", auth, userCtrl.deleteAccount); //,
//router.post("/admin/signup", userCtrl.signup);

module.exports = router;
