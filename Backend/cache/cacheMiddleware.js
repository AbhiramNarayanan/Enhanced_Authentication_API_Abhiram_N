import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

function cacheMiddleware(req, res, next) {
  const key = req.originalUrl || req.url;

  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Data retrieved from cache");
    return res.status(200).send(cachedData);
  }

  next();
}

export { cacheMiddleware, cache };
