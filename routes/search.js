const router = require("express").Router();
const searchCtrl = require("../controllers/search");

router.get("/search/:nom", searchCtrl.searchDog);

module.exports = router;
