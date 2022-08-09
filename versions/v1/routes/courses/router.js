const express = require("express");
const router = express.Router();

router.use("/info", require("./routes/info"))
router.use("/index", require("./routes/index"))

module.exports = router;
