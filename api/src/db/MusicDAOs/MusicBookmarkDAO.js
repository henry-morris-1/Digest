const db = require('../DBConnection');
const Album = require('../models/music/Album');

function getBookmarks (id) {
    return db.query('SELECT album_id, album_title, album_cover FROM album_bookmarks INNER JOIN albums ON album_bookmarks.album_id_fk = albums.album_id AND album_bookmarks.user_id_fk = ? ORDER BY album_bookmarks.bookmark_id DESC', [id]).then(({results}) => {
        return results.map(album => new Album(album));
    });
}

function isBookmarked (userId, albumId) {
    return db.query('SELECT * FROM album_bookmarks WHERE user_id_fk = ? AND  album_id_fk = ?', [userId, albumId]).then(({results}) => {
        if (results.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

function createBookmark (userId, album) {
    return db.query('INSERT IGNORE INTO albums (album_id, album_title, album_cover) VALUES (?, ?, ?); INSERT IGNORE INTO album_bookmarks (user_id_fk, album_id_fk) VALUES (?, ?);', [album.id, album.title, album.poster_path, userId, album.id]).then(() => {
        return getBookmarks(userId);
    });
}

function deleteBookmark (userId, albumId) {
    return db.query('DELETE FROM album_bookmarks WHERE user_id_fk = ? AND album_id_fk = ?', [userId, albumId]).then(() => {
        return getBookmarks(userId);
    });
}

module.exports = {
    getBookmarks: getBookmarks,
    isBookmarked: isBookmarked,
    createBookmark: createBookmark,
    deleteBookmark: deleteBookmark
};