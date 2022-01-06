const router = require("express").Router();
const adminCtrl = require("../controllers/admin");

//routes
router.delete("/admin/users/:id", adminCtrl.deleteUser);
router.put("/admin/users/:id", adminCtrl.updateUser);

module.exports = router;
