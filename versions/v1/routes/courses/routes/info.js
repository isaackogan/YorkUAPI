const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");

/**
 * Course Site Index
 */
router.get("/site_index", async (req, res) => {
    let result = await req.app.redis.get("yorku:course_site_index");

    if (!result) {
        return res.status(500).json({"error": "Site index was null/invalid. Try again later."});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Info
 */
router.get("/", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_info", tools.redifyName(tools.cleanRedis(req.query.code))].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested course."});
    }

    return res.json(JSON.parse(result));
});



module.exports = router;
