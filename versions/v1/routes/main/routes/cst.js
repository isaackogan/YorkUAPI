const express = require("express");
const router = express.Router();


router.post("/stats", async (req, res) => {
    let realPost = (req.headers.origin || "").includes("eulerstream.com");

    if (realPost) {
        await req.app.redis.incr(`yorku:cst:navs`);
    }

    return res.json({"message": "Successfully updated statistics"});

});

router.get("/stats", async (req, res) => {
    let num;
    try {
        num = parseInt(await req.app.redis.get(`yorku:cst:navs`))
    } catch (ex) {
        num = -1
    }

    return res.json({"navs": num});

});


module.exports = router;
