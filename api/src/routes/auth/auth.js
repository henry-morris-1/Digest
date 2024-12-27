const express = require('express');
const cookieParser = require('cookie-parser');

const { TokenMiddleware, generateToken, removeToken} = require('../../middleware/TokenMiddleware');
const UserDAO = require('../../db/UserDAO');

const router = express.Router();
router.use(cookieParser());

/**
 * Register a new user
 */
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    UserDAO.createUser(username, password).then(user => {
        generateToken(req, res, user);
        res.json(user);
    });
});

/**
 * Log a user in
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    UserDAO.getUserByCredentials(username, password).then(user => {
        generateToken(req, res, user);
        res.json(user);
    });
});

/**
 * Log a user out
 */
router.post('/logout', (req, res) => {
    removeToken(req, res);
    res.json({ success: true });
});

/**
 * Get the current user
 */
router.get('/current', TokenMiddleware, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;