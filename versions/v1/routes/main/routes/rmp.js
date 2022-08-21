const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");
const closestMatch = require("closest-match");

async function fuzzyMatch(key, redis) {
    let firstName = key.split(" ")[0];
    if (!firstName) return;

    let k = `yorku:rmp:${firstName}*`;
    if (!k) return;

    let result = await redis.keys(k);
    return closestMatch.closestMatch("", result);
}


router.post("/ratings", async (req, res) => {

    if (!req.body || !Array.isArray(req.body.professors)) {
        return res.status(400).json({"error": "Invalid payload"});
    }

    let results = []

    for (let prof of req.body.professors) {
        let cleaned = await fuzzyMatch(tools.cleanRedis(String(prof).toUpperCase()), req.app.redis);

        let result = await req.app.redis.get(
            ["yorku:rmp", cleaned].join(":")
        );

        let parsed;

        try {
            parsed = JSON.parse(result);
            parsed["query"] = cleaned;
            parsed["status"] = 200;
        } catch (ex) {
            parsed = {};
            parsed["query"] = cleaned;
            parsed["status"] = 404;
        }

        results.push(parsed)
    }

    return res.json(results);

});


module.exports = router;
