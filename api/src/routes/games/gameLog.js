const express = require('express');
const cookieParser = require('cookie-parser');

/** Import token middleware */
const { TokenMiddleware } = require('../../middleware/TokenMiddleware');

const router = express.Router();
router.use(cookieParser());
router.use(TokenMiddleware);

/** Import log DAO */
const LogDAO = require('../../db/GameDAOs/GameLogDAO');

/**
 * Get a user's logs
 */
router.get('/', (req, res) => {
    const userId = req.user.id;

    LogDAO.getLogs(userId).then(logs => {
        if (logs) {
            res.status(200).json(logs);
        } else {
            res.status(404).json({ error: 'Logs not found' });
        }
    });
});

/**
 * Get a user's logs for a given game
 */
router.get('/:gameId', (req, res) => {
    const userId = req.user.id;
    const gameId = req.params.gameId;

    LogDAO.getLogsByGameId(userId, gameId).then(logs => {
        if (logs) {
            res.status(200).json(logs);
        } else {
            res.status(404).json({ error: 'Logs not found' });
        }
    });
});

/**
 * Create a new log
 */
router.post('/', (req, res) => {
    const userId = req.user.id;
    const log = req.body;

    LogDAO.createLog(userId, log).then(logs => {
        res.status(200).json(logs);
    });
});

/**
 * Update a log
 */
router.put('/:logId', (req, res) => {
    const userId = req.user.id;
    const logId = req.params.logId;
    const log = req.body;

    LogDAO.updateLog(userId, logId, log).then(logs => {
        res.status(200).json(logs);
    });
});

/**
 * Delete a log
 */
router.delete('/:logId', (req, res) => {
    const userId = req.user.id;
    const logId = req.params.logId;

    LogDAO.deleteLog(userId, logId).then(logs => {
        res.status(200).json(logs);
    });
});

module.exports = router;