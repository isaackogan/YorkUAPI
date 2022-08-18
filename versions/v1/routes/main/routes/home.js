const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");

/**
 * Dining Data
 */
router.get("/dine-vendors", async (req, res) => {
    let result = await req.app.redis.get("yorku:dine_data");

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested resource."});
    }

    return res.json(JSON.parse(result));
});

/**
 * Building Acronyms
 */
router.get("/building-codes", async (req, res) => {
    let result = await req.app.redis.get("yorku:building_codes");

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested resource."});
    }

    return res.json(JSON.parse(result));
});

module.exports = router;
