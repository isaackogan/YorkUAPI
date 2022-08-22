const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");
const descriptions = require("../../../../../private/descriptions.json");

/**
 * Course Schedule Periods
 */
router.get("/periods", async (req, res) => {

    let result = await req.app.redis.get("yorku:course_schedule:periods");

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested information."});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Schedule by Period & Code
 */
router.get("/:period/:code/schedule", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_schedule", tools.cleanRedis(req.params.period), tools.cleanRedis(req.params.code)].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested courses schedule."});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Periods
 */
router.get("/:period/codes", async (req, res) => {

    let result = await req.app.redis.get(
        ['yorku:course_schedule', tools.cleanRedis(req.params.period), 'codes'].join(":")
    )

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested course list."});
    }

    return res.json(JSON.parse(result));
});


/**
 * Get description
 */
router.get("/:code/description", async (req, res) => {
    let code = tools.cleanRedis(req.params.code);
    let historic = false;

    // Remove faculty if supplied
    if ((code.split("-").length - 1) > 2) {
        code = code.substr(code.indexOf("-") + 1).trim();
    }

    let result = await req.app.redis.get(`yorku:course_desc:${code}`);

    // Historic Descriptions
    if (!result) {
        result = descriptions[code];
        historic = true;
    }

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested courses schedule."});
    }

    return res.json({
        "code": code,
        "description": result,
        "historic": historic
    });
});

function parse(str) {
    let data = JSON.parse(str).sections;
    let teachers = {}

    try {
        for (let [section, secInfo] of Object.entries(data)) {
            let classes = secInfo["classes"];
            if (!classes) continue;

            for (let classy of classes) {
                for (let instructor of classy["instructors"]) {
                    if (instructor.trim().length < 1) continue;
                    if (teachers[instructor]) {
                        teachers[instructor].push(section);
                    } else {
                        teachers[instructor] = [section]

                    }
                }
            }

        }
        return teachers;
    } catch
        (ex) {

    }
}


router.get("/:period/:code/teachers", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_schedule", tools.cleanRedis(req.params.period), tools.cleanRedis(req.params.code)].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested courses schedule."});
    }

    let teachers = parse(result)

    if (teachers) return res.json(teachers);
    else return res.status(500).json({"error": "Failed to parse course teachers"});

});


module.exports = router;
