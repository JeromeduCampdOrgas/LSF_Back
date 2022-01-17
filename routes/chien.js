const router = require("express").Router();
const chienCtrl = require("../controllers/chiens");

//const multer = require("../middleware/multer-chiens");
const multer = require("../middleware/multer-chiens-bis");

router.post("/chiens", multer, chienCtrl.createChien); //
router.get("/chiens/:refugeId", chienCtrl.getAllChiensOneRefuge); //

module.exports = router;
