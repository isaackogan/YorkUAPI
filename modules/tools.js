function redifyName(name) {
    return (name || "")
        .toLowerCase()
        .trim()
        .replaceAll(/\W+/g, "_")
        .replaceAll(/_+/g, "_")
}

function sanitizeRedisInput(input) {
    return (String(input) || "")
        .replaceAll(":", "")
        .replaceAll("eval", "")
        .replaceAll(";", "");
}

function sanitizeCSSFile(input) {
    return (input || "")
        .replaceAll(/[\n\r]/g, "")
}

module.exports = {
    redifyName: redifyName,
    cleanRedis: sanitizeRedisInput,
    cleanCSS: sanitizeCSSFile
}
