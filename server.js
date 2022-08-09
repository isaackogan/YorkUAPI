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

app.redis = redis.createClient({
    "url": `redis://default:${config.password}@${config.host}:${config.port}`
})

app.redis.connect().then(() => {
    Logger.INFO("Redis successfully connected")
})

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
    res.on("finish", () => Logger.INFO("%s - \"SIGN %s\"", res.statusCode, req.ip.replaceAll("::ffff:", ""), req.path));
    next();
});

app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/docs', swagger.serve, swagger.setup(require("./swagger.json"), {customCss: '.swagger-ui .topbar { display: none }', customSiteTitle: "TikTok Utilities",}));
app.use("/v1", v1Router);
app.get("/", (req, res) => { res.redirect("/docs") })
app.all('*', (req, res) => { res.status(404).json({ error: "Invalid Route" }); });

server.listen(PORT, () => Logger.INFO(`Listening on port ${PORT} for connections!`));
