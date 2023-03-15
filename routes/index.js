const router = require("express").Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.index);
router.get("/default", indexController.getDefalt);

module.exports = router;
