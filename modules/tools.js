function redifyName(name) {
    return (name || "")
        .toLowerCase()
        .trim()
        .replaceAll(/\W+/g, "_")
        .replaceAll(/_+/g, "_")
}

function sanitizeRedisInput(input) {
    return (input || "")
        .replaceAll(":", "");
}

module.exports = {
    redifyName: redifyName,
    cleanRedis: sanitizeRedisInput
}
