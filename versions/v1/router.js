const express = require("express");
const router = express.Router();

router.use("/courses", require("./routes/courses/router"))
router.use("/main", require("./routes/main/router"))

module.exports = router;
