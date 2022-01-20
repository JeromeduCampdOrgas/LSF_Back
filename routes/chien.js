const router = require("express").Router();
const chienCtrl = require("../controllers/chiens");

const multerCarousel = require("../middleware/multer-carousel");
const multer = require("../middleware/multer-chiens-bis");

router.post("/chiens", multer, chienCtrl.createChien); //
router.get("/chiens/:refugeId", chienCtrl.getAllChiensOneRefuge);
router.post("/chiens/carousel", multerCarousel, chienCtrl.carousel); //

module.exports = router;
