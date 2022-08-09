const express = require("express");
const router = express.Router();
const tools = require("../../../../../modules/tools");


/**
 * Course Index by All
 */
router.get("/", async (req, res) => {
    let result = await req.app.redis.get(`yorku:course_index`);

    if (!result) {
        return res.status(500).json({"error": "Course index was null/invalid. Try again later."});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Periods
 */
router.get("/periods", async (req, res) => {
    let result = await req.app.redis.get(`yorku:course_index:periods`);

    if (!result) {
        return res.status(500).json({"error": "Course periods were null/invalid. Try again later."});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Index by Period
 */
router.get("/:period", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_index", tools.cleanRedis(req.params.period)].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested course"});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Faculties
 */
router.get("/:period/faculties", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_index", tools.cleanRedis(req.params.period), "faculties"].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested faculties"});
    }

    return res.json(JSON.parse(result));
});


/**
 * Course Index by Faculty
 */
router.get("/:period/:faculty", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_index", tools.cleanRedis(req.params.period), tools.cleanRedis(req.params.faculty)].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested courses"});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Subjects
 */
router.get("/:period/:faculty/subjects", async (req, res) => {
    let result = await req.app.redis.get(
        ["yorku:course_index", tools.cleanRedis(req.params.period), tools.cleanRedis(req.params.faculty), "subjects"].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested subjects"});
    }

    return res.json(JSON.parse(result));
});

/**
 * Course Index by Subject
 */
router.get("/:period/:faculty/:subject", async (req, res) => {

    let result = await req.app.redis.get(
        ["yorku:course_index", tools.cleanRedis(req.params.period), tools.cleanRedis(req.params.faculty), tools.cleanRedis(req.params.subject)].join(":")
    );

    if (!result) {
        return res.status(404).json({"error": "Could not find the requested courses"});
    }

    return res.json(JSON.parse(result));
});


module.exports = router;
