const express = require("express");
const router = express.Router();

router.use("/courses", require("./routes/courses/router"))

module.exports = router;
