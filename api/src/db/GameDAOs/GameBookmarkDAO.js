const db = require('../DBConnection');
const Game = require('../models/games/Game');

function getBookmarks (id) {
    return db.query('SELECT game_id, game_title, game_cover FROM game_bookmarks INNER JOIN games ON game_bookmarks.game_id_fk = games.game_id AND game_bookmarks.user_id_fk = ? ORDER BY game_bookmarks.bookmark_id DESC', [id]).then(({results}) => {
        return results.map(game => new Game(game));
    });
}

function isBookmarked (userId, gameId) {
    return db.query('SELECT * FROM game_bookmarks WHERE user_id_fk = ? AND game_id_fk = ?', [userId, gameId]).then(({results}) => {
        if (results.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

function createBookmark (userId, game) {
    return db.query('INSERT IGNORE INTO games (game_id, game_title, game_cover) VALUES (?, ?, ?)', [game.id, game.title, game.poster_path]).then(({results}) => {
        return db.query('INSERT IGNORE INTO game_bookmarks (user_id_fk, game_id_fk) VALUES (?, ?)', [userId, game.id]).then(({results}) => {
            return getBookmarks(userId);
        });
    });
}

function deleteBookmark (userId, gameId) {
    return db.query('DELETE FROM game_bookmarks WHERE user_id_fk = ? AND game_id_fk = ?', [userId, gameId]).then(({results}) => {
        return getBookmarks(userId);
    });
}

module.exports = {
    getBookmarks: getBookmarks,
    isBookmarked: isBookmarked,
    createBookmark: createBookmark,
    deleteBookmark: deleteBookmark
};