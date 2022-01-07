const router = require("express").Router();
const admin = require("../controllers/admin");
const adminCtrl = require("../controllers/admin");

//routes
router.post("/admin/users", admin.createUser);
router.delete("/admin/users/:id", adminCtrl.deleteUser);
router.put("/admin/users/:id", adminCtrl.updateUser);

module.exports = router;
