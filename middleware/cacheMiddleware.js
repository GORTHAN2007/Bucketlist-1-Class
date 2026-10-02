const cache = {};
const TTL_MS = 60 * 1000; // 1 minute (as per documentation)

function cacheMiddleware(req, res, next) {
    const key = req.url;
    const cachedItem = cache[key];

    if (cachedItem) {
        const isExpired = Date.now() - cachedItem.timestamp > TTL_MS;
        if (!isExpired) {
            res.setHeader("X-Cache", "HIT");
            return res.json(cachedItem.data);
        }
        delete cache[key];
    }
    res.setHeader("X-Cache", "MISS");
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cache[key] = {
                data: body,
                timestamp: Date.now()
            };
        }
        return originalJson(body);
    };
    next();
}

function clearCache() {
    for (const key in cache) {
        delete cache[key];
    }
}

module.exports = {
    cacheMiddleware,
    clearCache
};
