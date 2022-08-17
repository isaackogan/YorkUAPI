const express = require("express");
const router = express.Router();

router.use("/dine", require("./routes/dine"));
router.use("/api", require("./routes/api"));

module.exports = router;
