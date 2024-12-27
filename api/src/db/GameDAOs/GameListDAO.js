const db = require('../DBConnection');
const List = require('../models/games/List');
const Game = require('../models/games/Game');

function getLists (id) {
    return db.query('SELECT list_id, title FROM game_lists WHERE user_id_fk = ?', [id]).then(({results}) => {
        // Get the list details for each list from the user
        const lists = results.map(list => new List(list));

        // Create a list of promises for getting the games for each list
        const promises = [];
        
        // Call the database to get the games for each list
        lists.forEach(list => {
            promises.push(db.query('SELECT list_index, game_id, game_title, game_cover FROM game_list_items INNER JOIN games ON game_list_items.game_id_fk = games.game_id AND game_list_items.list_id_fk = ? ORDER BY game_list_items.list_index', [list.id]).then(({results}) => {
                list.games = results.map(game => new Game(game));
            }));
        });

        // Return the lists when all promises are resolved
        return Promise.all(promises).then(() => {
            return lists;
        });
    });
}

function getListById (userId, listId) {
    return db.query('SELECT * FROM game_lists WHERE user_id_fk = ? AND list_id = ?', [userId, listId]).then(({results}) => {
        // Get the first result
        const list = results.map(list => new List(list))[0];

        // Get the games for the list, then return
        return db.query('SELECT list_index, game_id, game_title, game_cover FROM game_list_items INNER JOIN games ON game_list_items.game_id_fk = games.game_id AND game_list_items.list_id_fk = ? ORDER BY game_list_items.list_index', [listId])
            .then(({results}) => {
                list.games = results.map(game => new Game(game));
            })
            .then(() => {
                return list;
            });
    });
}

function createList (userId, list) {
    const title = list.title;
    const gameId = list.game.id;
    const gameTitle = list.game.title;
    const gamePoster = list.game.poster_path;

    return db.query('INSERT INTO game_lists (user_id_fk, title) VALUES (?, ?); SET @ListID = LAST_INSERT_ID(); INSERT IGNORE INTO games (game_id, game_title, game_cover) VALUES (?, ?, ?); INSERT INTO game_list_items (list_id_fk, list_index, game_id_fk) VALUES (@ListID, 1, ?);', [userId, title, gameId, gameTitle, gamePoster, gameId]).then(() => {
        return getLists(userId);
    });
}

function addGameToList (userId, listId, game) {
    return db.query('SET @NewIndex = (SELECT MAX(list_index) FROM game_list_items WHERE list_id_fk = ?) + 1; INSERT IGNORE INTO games (game_id, game_title, game_cover) VALUES (?, ?, ?); INSERT INTO game_list_items (list_id_fk, list_index, game_id_fk) VALUES (?, @NewIndex, ?);', [listId, game.id, game.title, game.poster_path, listId, game.id]).then(() => {
        return getLists(userId);
    });
}

function editList (userId, listId, list) {
    // Update the list title, then delete all existing list items
    return db.query('UPDATE game_lists SET title = ? WHERE user_id_fk = ? AND list_id = ?; DELETE FROM game_list_items WHERE list_id_fk = ?;', [list.title, userId, listId, listId]).then(() => {
        // Create a list of promises for adding the games in the list
        const promises = [];

        // For each game in the updated list, add it back in
        list.games.map((game, index) => {
            promises.push(db.query('INSERT IGNORE INTO games (game_id, game_title, game_cover) VALUES (?, ?, ?); INSERT INTO game_list_items (list_id_fk, list_index, game_id_fk) VALUES (?, ?, ?);', [game.id, game.title, game.poster_path, listId, index, game.id]));
        });

        // Return when all promises have been resolved
        return Promise.all(promises).then(() => {
            return getLists(userId);
        });
    });
}

function deleteList (userId, listId) {
    return db.query('DELETE FROM game_list_items WHERE list_id_fk = ?; DELETE FROM game_lists WHERE user_id_fk = ? AND list_id = ?;', [listId, userId, listId]).then(() => {
        return getLists(userId);
    });
}

module.exports = {
    getLists: getLists,
    getListById: getListById,
    createList: createList,
    addGameToList: addGameToList,
    editList: editList,
    deleteList: deleteList
}