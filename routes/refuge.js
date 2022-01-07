const router = require("express").Router();
const refugeCtrl = require("../controllers/refuge");

const multer = require("../middleware/multer-config");

router.post("/refuge", refugeCtrl.createRefuge); //authUser.valid,

module.exports = router;
