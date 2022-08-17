const express = require("express");
const router = express.Router();

/**
 * Dining Data
 */
router.get("/about", async (req, res) => {
    return res.json({
        "author": "Isaac Kogan",
        "email": "info@isaackogan.com",
        "website": "https://isaackogan.com",
        "inception": "August 8th, 2022",
        "memory": process.memoryUsage(),
        "node_version": process.version,
        "platform": process.platform,
        "uptime": process.uptime()
    });
});

module.exports = router;
