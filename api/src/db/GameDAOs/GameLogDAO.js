const db = require('../DBConnection');
const Game = require('../models/games/Game');
const Log = require('../models/games/Log');

function getLogs (id) {
    return db.query('SELECT log_id, date_start, date_end, rating, review, game_id, game_title, game_cover FROM game_log INNER JOIN games ON game_log.game_id_fk = games.game_id AND game_log.user_id_fk = ? ORDER BY date_end DESC', [id]).then(({results}) => {
        return results.map(log => new Game(log));
    });
}

function getLogsByGameId (userId, gameId) {
    return db.query('SELECT log_id, date_start, date_end, rating, review, game_id, game_title, game_cover FROM game_log INNER JOIN games ON game_log.game_id_fk = games.game_id AND game_log.game_id_fk = ? AND game_log.user_id_fk = ? ORDER BY date_end', [gameId, userId]).then(({results}) => {
        return results.map(log => new Log(log));
    });
}

function createLog (userId, log) {
    return db.query('INSERT IGNORE INTO games (game_id, game_title, game_cover) VALUES (?, ?, ?)', [log.game.id, log.game.title, log.game.poster_path]).then(({results}) => {
        return db.query('INSERT INTO game_log (user_id_fk, game_id_fk, date_start, date_end, rating, review) VALUES (?, ?, ?, ?, ?, ?)', [userId, log.game.id, log.date_start, log.date_end, log.rating, log.review]).then(({results}) => {
            return getLogs(userId);
        });
    });
}

function updateLog (userId, logId, log) {
    return db.query('UPDATE game_log SET date_start = ?, date_end = ?, rating = ?, review = ? WHERE user_id_fk = ? AND log_id = ?;', [log.date_start, log.date_end, log.rating, log.review, userId, logId]).then(({results}) => {
        return getLogs(userId);
    });
}

function deleteLog (userId, logId) {
    return db.query('DELETE FROM game_log WHERE user_id_fk = ? AND log_id = ?', [userId, logId]).then(({results}) => {
        return getLogs(userId);
    });
}

module.exports = {
    getLogs: getLogs,
    getLogsByGameId: getLogsByGameId,
    createLog: createLog,
    updateLog: updateLog,
    deleteLog: deleteLog
};