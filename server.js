const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const Logger = require("./modules/logger")
const v1Router = require("./versions/v1/router");
const config = require("./config.json");
const swagger = require("swagger-ui-express");
const redis = require("redis");
const { rateLimit } = require('express-rate-limit');
const fs = require("fs");
const tools = require("./modules/tools");

app.redis = redis.createClient({"url": `redis://default:${config.password}@${config.host}:${config.port}`});

app.redis.connect().then(() => {
    Logger.INFO("Redis successfully connected");
})


/**
 * API Rate Limit
 */
const rateLimitMinute = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    message: {
       "error": "Too many requests. Try again later." // TODO test if this works with ip fwding rn
    }
});

/**
 * CORS Settings
 */
app.options("*", (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

/**
 * Log Requests
 */
app.use((req, res, next) => {
    res.on("finish", () => Logger.INFO("%s - \"GET %s\"", res.statusCode, req.header("cf-connecting-ip") || req.ip.replaceAll("::ffff:", ""), req.url));
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/cheese", (req, res) => {
    console.log(app.routes)
})

app.use('/docs', swagger.serve, swagger.setup(require("./swagger.json"), {
        customCss: tools.cleanCSS(fs.readFileSync("./private/override.css", {encoding: "utf-8", flag: "r"})),
        customSiteTitle: "YorkU Unofficial API",
        customfavIcon: "/public/favicon.ico",
}));
app.use("/public", express.static(__dirname + "/public"));
app.use("/v1", rateLimitMinute, v1Router);
app.get("/", (req, res) => { res.redirect("/docs") })
app.all('*', (req, res) => { res.status(404).json({ error: "Invalid Route" }); });

server.listen(PORT,  () => Logger.INFO(`Listening on port ${PORT} for connections!`));
