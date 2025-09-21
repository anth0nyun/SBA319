export function requireJson(req, res, next) {
    if (req.method == "POST" || req.method == "PUT" || req.method === "PATCH") {
        if (req.is("application/json")) {
            return next();
        }
        return res.status(415).json({ error: "Content-Type must be application/json" });
    }
    next();
}