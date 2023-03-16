const router = require("express").Router();
const { index, getDefault } = require("../controllers/indexController");

router.get("/", index);
router.get("/default", getDefault);

module.exports = router;
