const router = require("express").Router();
const userCtrl = require("../controllers/user");
const authUser = require("../middleware/authUser");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/signup", userCtrl.signup); //authUser.valid,
router.post("/login", authUser.checkUsername, userCtrl.login); //authUser.valid,
router.get("/users", userCtrl.getAllUsers); //auth,
router.put("/users/:id", auth, multer, userCtrl.updateAccount);
router.get("/users/:id", userCtrl.getAccount); //auth,
router.delete("/users/:id", auth, userCtrl.deleteAccount); //
//router.post("/admin/signup", userCtrl.signup);

module.exports = router;
