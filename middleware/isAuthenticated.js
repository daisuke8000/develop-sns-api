const {verify} = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: "Unauthenticated"});
    }

    try {
        verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({message: "Unauthenticated"});
            }
            req.userId = decodedToken.id;
            next();
        });
    } catch (err) {
        return res.status(401).json({message: "Unauthenticated"});
    }
}

module.exports = isAuthenticated;