const router = require("express").Router();
const refugeCtrl = require("../controllers/refuge");

//const multer = require("../middleware/multer-config");
const multer = require("../middleware/multer-refuges");

router.post("/refuge", multer, refugeCtrl.createRefuge); //
router.get("/refuge", refugeCtrl.getAllRefuge); //auth,
router.get("/refuge/:name", refugeCtrl.getOneRefuge);
router.put("/refuge/:id", multer, refugeCtrl.updateRefuge);
module.exports = router;
