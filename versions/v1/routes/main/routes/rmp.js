const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");
const closestMatch = require("closest-match");

async function fuzzyMatch(professor, professors) {

    // Parse Name
    let split = professor.split(" ");
    let firstName = split?.[0];
    let lastName = split?.[split.length - 1];

    // Check validity
    if (!(firstName && lastName)) return professor;

    // Calculate closest match
    let closest = (closestMatch.closestMatch(professor, professors) || "");

    // Return match if it contains our name
    return (closest.includes(firstName) && closest.includes(lastName)) ? closest : professor;
}


router.post("/ratings", async (req, res) => {

    // Check payload validity
    if (!req.body || !Array.isArray(req.body.professors)) {
        return res.status(400).json({"error": "Invalid payload"});
    }

    // Get professor list
    let professors = await req.app.redis.get("yorku:rmp:teachers");
    if (!professors) return;
    professors = JSON.parse(professors);

    let results = []

    for (let professor of req.body.professors) {

        // Build match
        let match = await fuzzyMatch(professor.toUpperCase(), professors);
        let result = await req.app.redis.get(["yorku:rmp", match].join(":"));
        let parsed;

        // Parse query
        try {
            parsed = JSON.parse(result);
            parsed["query"] = professor;
            parsed["status"] = 200;
        } catch (ex) {
            parsed = {};
            parsed["query"] = match;
            parsed["status"] = 404;
        }

        // Send off result
        results.push(parsed)
    }

    return res.json(results);

});


module.exports = router;
