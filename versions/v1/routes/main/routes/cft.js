const express = require("express");
const router = express.Router();


router.post("/stats", async (req, res) => {
    let realPost = (req.headers.origin || "").includes("yorku.dev");

    if (realPost) {
        await req.app.redis.incr(`yorku:cft:navs`);
    }

    return res.json({"message": "Successfully updated statistics"});

});

router.get("/stats", async (req, res) => {
    let num;
    try {
        num = parseInt(await req.app.redis.get(`yorku:cft:navs`))
    } catch (ex) {
        num = -1
    }

    return res.json({"navs": num});

});


module.exports = router;
