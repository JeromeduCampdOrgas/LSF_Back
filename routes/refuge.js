const router = require("express").Router();
const refugeCtrl = require("../controllers/refuge");

const multer = require("../middleware/multer-config");

router.post("/refuge", multer, refugeCtrl.createRefuge); //

module.exports = router;
