const router = require("express").Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.index);

module.exports = router;
