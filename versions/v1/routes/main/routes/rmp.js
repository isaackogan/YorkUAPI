const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");
const closestMatch = require("closest-match");

async function fuzzyMatch(key, redis) {
    let split = key.split(" ");

    let firstName = split?.[0];
    let lastName = split?.[split.length - 1];

    if (!firstName) return;

    let k = `yorku:rmp:${firstName}*`;
    if (!k) return;

    let result = await redis.keys(k);
    let closest = closestMatch.closestMatch(key, result).replace("yorku:rmp:", "");

    return (closest.includes(firstName) && closest.includes(lastName)) ? closest : key;
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
            parsed["query"] = prof;
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
