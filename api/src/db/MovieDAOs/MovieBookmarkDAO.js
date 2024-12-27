const db = require('../DBConnection');
const Movie = require('../models/movies/Movie');

function getBookmarks (id) {
    return db.query('SELECT movie_id, movie_title, movie_poster FROM movie_bookmarks INNER JOIN movies ON movie_bookmarks.movie_id_fk = movies.movie_id AND movie_bookmarks.user_id_fk = ? ORDER BY movie_bookmarks.bookmark_id DESC', [id]).then(({results}) => {
        return results.map(movie => new Movie(movie));
    });
}

function isBookmarked (userId, movieId) {
    return db.query('SELECT * FROM movie_bookmarks WHERE user_id_fk = ? AND  movie_id_fk = ?', [userId, movieId]).then(({results}) => {
        if (results.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

function createBookmark (userId, movie) {
    return db.query('INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES (?, ?, ?)', [movie.id, movie.title, movie.poster_path]).then(({results}) => {
        return db.query('INSERT IGNORE INTO movie_bookmarks (user_id_fk, movie_id_fk) VALUES (?, ?)', [userId, movie.id]).then(({results}) => {
            return getBookmarks(userId);
        });
    });
}

function deleteBookmark (userId, movieId) {
    return db.query('DELETE FROM movie_bookmarks WHERE user_id_fk = ? AND movie_id_fk = ?', [userId, movieId]).then(({results}) => {
        return getBookmarks(userId);
    });
}

module.exports = {
    getBookmarks: getBookmarks,
    isBookmarked: isBookmarked,
    createBookmark: createBookmark,
    deleteBookmark: deleteBookmark
};