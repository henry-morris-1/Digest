const db = require('../DBConnection');
const List = require('../models/music/List');
const Album = require('../models/music/Album');

function getLists (id) {
    return db.query('SELECT list_id, title FROM album_lists WHERE user_id_fk = ?', [id]).then(({results}) => {
        // Get the list details for each list from the user
        const lists = results.map(list => new List(list));

        // Create a list of promises for getting the albums for each list
        const promises = [];
        
        // Call the database to get the albums for each list
        lists.forEach(list => {
            promises.push(db.query('SELECT list_index, album_id, album_title, album_cover FROM album_list_items INNER JOIN albums ON album_list_items.album_id_fk = albums.album_id AND album_list_items.list_id_fk = ? ORDER BY album_list_items.list_index', [list.id]).then(({results}) => {
                list.albums = results.map(album => new Album(album));
            }));
        });

        // Return the lists when all promises are resolved
        return Promise.all(promises).then(() => {
            return lists;
        });
    });
}

function getListById (userId, listId) {
    return db.query('SELECT * FROM album_lists WHERE user_id_fk = ? AND list_id = ?', [userId, listId]).then(({results}) => {
        // Get the first result
        const list = results.map(list => new List(list))[0];

        // Get the albums for the list, then return
        return db.query('SELECT list_index, album_id, album_title, album_cover FROM album_list_items INNER JOIN albums ON album_list_items.album_id_fk = albums.album_id AND album_list_items.list_id_fk = ? ORDER BY album_list_items.list_index', [listId])
            .then(({results}) => {
                list.albums = results.map(album => new Album(album));
            })
            .then(() => {
                return list;
            });
    });
}

function createList (userId, list) {
    const title = list.title;
    const albumId = list.album.id;
    const albumTitle = list.album.title;
    const albumCover = list.album.poster_path;

    return db.query('INSERT INTO album_lists (user_id_fk, title) VALUES (?, ?); SET @ListID = LAST_INSERT_ID(); INSERT IGNORE INTO albums (album_id, album_title, album_cover) VALUES (?, ?, ?); INSERT INTO album_list_items (list_id_fk, list_index, album_id_fk) VALUES (@ListID, 1, ?);', [userId, title, albumId, albumTitle, albumCover, albumId]).then(() => {
        return getLists(userId);
    });
}

function addAlbumToList (userId, listId, album) {
    return db.query('SET @NewIndex = (SELECT MAX(list_index) FROM album_list_items WHERE list_id_fk = ?) + 1; INSERT IGNORE INTO albums (album_id, album_title, album_cover) VALUES (?, ?, ?); INSERT INTO album_list_items (list_id_fk, list_index, album_id_fk) VALUES (?, @NewIndex, ?);', [listId, album.id, album.title, album.poster_path, listId, album.id]).then(() => {
        return getLists(userId);
    });
}

function editList (userId, listId, list) {
    // Update the list title, then delete all existing list items
    return db.query('UPDATE album_lists SET title = ? WHERE user_id_fk = ? AND list_id = ?; DELETE FROM album_list_items WHERE list_id_fk = ?;', [list.title, userId, listId, listId]).then(() => {
        // Create a list of promises for adding the albums in the list
        const promises = [];

        // For each album in the updated list, add it back in
        list.albums.map((album, index) => {
            promises.push(db.query('INSERT IGNORE INTO albums (album_id, album_title, album_cover) VALUES (?, ?, ?); INSERT INTO album_list_items (list_id_fk, list_index, album_id_fk) VALUES (?, ?, ?);', [album.id, album.title, album.poster_path, listId, index, album.id]));
        });

        // Return when all promises have been resolved
        return Promise.all(promises).then(() => {
            return getLists(userId);
        });
    });
}

function deleteList (userId, listId) {
    return db.query('DELETE FROM album_list_items WHERE list_id_fk = ?; DELETE FROM album_lists WHERE user_id_fk = ? AND list_id = ?;', [listId, userId, listId]).then(() => {
        return getLists(userId);
    });
}

module.exports = {
    getLists: getLists,
    getListById: getListById,
    createList: createList,
    addAlbumToList: addAlbumToList,
    editList: editList,
    deleteList: deleteList
}