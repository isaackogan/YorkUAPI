const express = require("express");
const router = express.Router();

router.use("/home", require("./routes/home"));
router.use("/api", require("./routes/api"));
router.use("/rmp", require("./routes/rmp"));

module.exports = router;
