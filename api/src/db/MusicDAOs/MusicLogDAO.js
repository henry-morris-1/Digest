const db = require('../DBConnection');
const Album = require('../models/music/Album');
const Log = require('../models/music/Log');

function getLogs (id) {
    return db.query('SELECT log_id, date, rating, review, album_id, album_title, album_cover FROM album_log INNER JOIN albums ON album_log.album_id_fk = albums.album_id AND album_log.user_id_fk = ? ORDER BY date DESC', [id]).then(({results}) => {
        return results.map(log => new Album(log));
    });
}

function getLogsByAlbumId (userId, albumId) {
    return db.query('SELECT log_id, date, rating, review, album_id, album_title, album_cover FROM album_log INNER JOIN albums ON album_log.album_id_fk = albums.album_id AND album_log.album_id_fk = ? AND album_log.user_id_fk = ? ORDER BY date', [albumId, userId]).then(({results}) => {
        return results.map(log => new Log(log));
    });
}

function createLog (userId, log) {
    return db.query('INSERT IGNORE INTO albums (album_id, album_title, album_cover) VALUES (?, ?, ?); INSERT INTO album_log (user_id_fk, album_id_fk, date, rating, review) VALUES (?, ?, ?, ?, ?);', [log.album.id, log.album.title, log.album.poster_path, userId, log.album.id, log.date, log.rating, log.review]).then(() => {
        return getLogs(userId);
    });
}

function updateLog (userId, logId, log) {
    return db.query('UPDATE album_log SET date = ?, rating = ?, review = ? WHERE user_id_fk = ? AND log_id = ?;', [log.date, log.rating, log.review, userId, logId]).then(() => {
        return getLogs(userId);
    });
}

function deleteLog (userId, logId) {
    return db.query('DELETE FROM album_log WHERE user_id_fk = ? AND log_id = ?', [userId, logId]).then(({results}) => {
        return getLogs(userId);
    });
}

module.exports = {
    getLogs: getLogs,
    getLogsByAlbumId: getLogsByAlbumId,
    createLog: createLog,
    updateLog: updateLog,
    deleteLog: deleteLog
};