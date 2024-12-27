const jwt = require('jsonwebtoken');

/** Token name and secret for generating a JWT */
const COOKIE_NAME = "Digest";
const API_SECRET_KEY = process.env.API_SECRET_KEY;

if (!API_SECRET_KEY) throw new Error('API_SECRET_KEY not found');

/**
 * Gets the Digest authentication token from a request
 * @returns Digest token from the resuts
 */
function getTokenFromRequest(req) {
    let token;

    if (req.cookies && req.cookies[COOKIE_NAME]) {
        token = req.cookies[COOKIE_NAME];
    } else {
        // Check auth header
        const authHeader = req.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.split(" ")[1].trim();
        }
    }

    return token;
}

/**
 * Gets and validates the token  in a request to ensure it is being made by
 * and authenticated user
 */
exports.TokenMiddleware = (req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const decoded = jwt.verify(token, API_SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    req.user = decoded.user;
    next();
}

/**
 * Generates a new JWT which lasts 1 hour
 * @param {Object} user User to create a token for
 * @returns New digest token for the given user
 */
exports.generateToken = (req, res, user) => {
    const data = {
        user: {
            id: user.id,
            username: user.username,
        },
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };

    delete data.user.salt;
    delete data.user.password;
    const token = jwt.sign(data, API_SECRET_KEY);

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000 // Expiration of 1 hour
    });
}

/**
 * Remove the token and ask the browser to delete the cookie
 */
exports.removeToken = (req, res) => {
    res.cookie(COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        maxAge: -10000 // Set in the past so the browser deletes it
    });
}