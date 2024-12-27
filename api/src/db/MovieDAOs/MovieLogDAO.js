const db = require('../DBConnection');
const Movie = require('../models/movies/Movie');
const Log = require('../models/movies/Log');

function getLogs (id) {
    return db.query('SELECT log_id, date, rating, review, movie_id, movie_title, movie_poster FROM movie_log INNER JOIN movies ON movie_log.movie_id_fk = movies.movie_id AND movie_log.user_id_fk = ? ORDER BY date DESC', [id]).then(({results}) => {
        return results.map(log => new Movie(log));
    });
}

function getLogsByMovieId (userId, movieId) {
    return db.query('SELECT log_id, date, rating, review, movie_id, movie_title, movie_poster FROM movie_log INNER JOIN movies ON movie_log.movie_id_fk = movies.movie_id AND movie_log.movie_id_fk = ? AND movie_log.user_id_fk = ? ORDER BY date', [movieId, userId]).then(({results}) => {
        return results.map(log => new Log(log));
    });
}

function createLog (userId, log) {
    return db.query('INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES (?, ?, ?)', [log.movie.id, log.movie.title, log.movie.poster_path]).then(({results}) => {
        return db.query('INSERT INTO movie_log (user_id_fk, movie_id_fk, date, rating, review) VALUES (?, ?, ?, ?, ?)', [userId, log.movie.id, log.date, log.rating, log.review]).then(({results}) => {
            return getLogs(userId);
        });
    });
}

function updateLog (userId, logId, log) {
    return db.query('UPDATE movie_log SET date = ?, rating = ?, review = ? WHERE user_id_fk = ? AND log_id = ?;', [log.date, log.rating, log.review, userId, logId]).then(({results}) => {
        return getLogs(userId);
    });
}

function deleteLog (userId, logId) {
    return db.query('DELETE FROM movie_log WHERE user_id_fk = ? AND log_id = ?', [userId, logId]).then(({results}) => {
        return getLogs(userId);
    });
}

module.exports = {
    getLogs: getLogs,
    getLogsByMovieId: getLogsByMovieId,
    createLog: createLog,
    updateLog: updateLog,
    deleteLog: deleteLog
};