/** GiantBomb API key */
const KEY = 'fcf7d4cc59da8178c6ec426949ec3b13a9561047';

/** HTTP Client */
import HTTPClient from './HTTPClient';


////////////////////////
/** LOGGED GAME CALLS */
////////////////////////

/**
 * Get a list of games objects
 * @returns List of logged games
 */
const getLogItems = () => {
    const url = '/api/users/games/log';
    return HTTPClient.get(url);
}

/**
 * Get a list of log object corresponding to the game id
 * @param {Number} gameId Game to retrieve logs for
 * @returns List of logs for the given game
 */
const getLogsById = (gameId) => {
    const url = '/api/users/games/log/' + gameId;
    return HTTPClient.get(url);
}

/**
 * Post a new game log
 * @param {Object} game Game to log
 * @param {Object} log Game log to post
 */
const createLog = (game, log) => {
    log.game = game;
    const url = '/api/users/games/log';
    return HTTPClient.post(url, log);
}

/**
 * Edits an existing game log
 * @param {Number} logId Game id to edit
 * @param {Number} game Game to log
 * @param {Object} log Game log to insert
 */
const updateLog = (logId, game, log) => {
    log.game = game;
    const url = '/api/users/games/log/' + logId;
    return HTTPClient.put(url, log);
}

/**
 * Deletes and exising game log
 * @param {Number} logId Log to delete
 */
const deleteLog = (logId) => {
    const url = '/api/users/games/log/' + logId;
    return HTTPClient.delete(url);
}


//////////////////////////
/** BOOKMARK GAME CALLS */
//////////////////////////

/**
 * Get bookmarked games
 * @returns Bookmarked games
 */
const getBookmarks = () => {
    const url = '/api/users/games/bookmarks';
    return HTTPClient.get(url);
}

/**
 * Checks if a game is bookmarked
 * @param {Number} gameId Game id to check for a bookmark
 * @returns True if bookmarked, false otherwise
 */
const isBookmarked = (gameId) => {
    const url = '/api/users/games/bookmarks/' + gameId;
    return HTTPClient.get(url);
}

/**
 * Post a new game bookmark
 * @param {Object} bookmark Game bookmark to post
 */
const createBookmark = (bookmark) => {
    const url = '/api/users/games/bookmarks';
    return HTTPClient.post(url, bookmark);
}

/**
 * Deletes and exising game bookmark
 * @param {Number} gameId Game id to delete from bookmarks
 */
const deleteBookmark = (gameId) => {
    const url = '/api/users/games/bookmarks/' + gameId;
    return HTTPClient.delete(url);
}


//////////////////////
/** GAME LIST CALLS */
//////////////////////

/**
 * Gets an array of game lists created by the user
 * @param {Number} id User to get for
 */
const getLists = () => {
    const url = '/api/users/games/lists';
    return HTTPClient.get(url);
}

/**
 * Post a new game list
 * @param {String} title List title
 * @param {Object} game Game to add to the list
 */
const createList = (title, game) => {
    const url = '/api/users/games/lists';
    return HTTPClient.post(url, {title: title, game: game});
}

/**
 * Gets a specific game list created by the user
 * @param {Number} listId List to get
 */
const getListById = (listId) => {
    const url = '/api/users/games/lists/' + listId;
    return HTTPClient.get(url);
}

/**
 * Posts a game into a user's list
 * @param {Number} listId List to post into
 * @param {Object} game Game to post
 */
const addToList = (listId, game) => {
    const url = '/api/users/games/lists/' + listId;
    return HTTPClient.post(url, game);
}

/**
 * Puts a game list
 * @param {Number} listId List to update
 * @param {String} title List title
 * @param {Array} games List of games
 */
const updateList = (listId, title, games) => {
    const url = '/api/users/games/lists/' + listId;
    return HTTPClient.put(url, {title: title, games: games});
}

/**
 * Delete a game list
 * @param {Number} listId List to delete
 */
const deleteList = (listId) => {
    const url = '/api/users/games/lists/' + listId;
    return HTTPClient.delete(url);
}


//////////////////////////
/** GiantBomb API CALLS */
//////////////////////////

/**
 * Makes a fetch request for a game from GiantBomb
 * @param {Number} id Game id (per GiantBomb)
 * @returns Game data
 */
const getById = (id) => {
    const callback = 'callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000); // Generate a new callback function name
    const url = 'https://www.giantbomb.com/api/game/' + id + '/?format=jsonp&json_callback=' + callback + '&api_key=' + KEY;
    return HTTPClient.getJsonp(url, callback).then(response => {
        return response.results;
    });
}

/**
 * Gets search results for a game query from GiantBomb
 * @param {String} query Search query
 * @returns Search data
 */
const getSearch = (query) => {
    const callback = 'callback_' + Date.now() + '_' + Math.floor(Math.random() * 1000); // Generate a new callback function name
    const url = 'https://www.giantbomb.com/api/search/?query=' + encodeURIComponent(query) + '&resources=game&format=jsonp&json_callback=' + callback + '&api_key=' + KEY;
    return HTTPClient.getJsonp(url, callback).then(response => {
        return response.results;
    });
}

/**
 * Creates an object with all necessary fields from an object obtained from the
 * GiantBomb API.
 * @param {Object} game GiantBomb API game object
 * @returns New object with standardized fields
 */
const toStandardObject = (game) => {
    return returnPromise()
        .then(() => {
            if (!game['developers']) {
                return getById(game['id']).then(newGame => {
                    game = newGame;
                    return;
                });
            } else {
                return;
            }
        })
        .then(() => {
            const obj = {
                id: game['id'],
                title: game['name'],
                poster_path: game['image']['small_url'],
                creators: game['developers'] && game['developers'][0]['name'],
                year: game['original_release_date'] && game['original_release_date'].substring(0, 4),
                runtime: '',
                summary: game['deck']
            };
            return obj;
        });
}

/**
 * Creates a new promise to easily return a chain of promises
 * from a function
 */
function returnPromise() {
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

const api = {
    getLogItems,
    getLogsById,
    createLog,
    updateLog,
    deleteLog,
    getBookmarks,
    isBookmarked,
    createBookmark,
    deleteBookmark,
    getLists,
    createList,
    getListById,
    addToList,
    updateList,
    deleteList,
    getById,
    getSearch,
    toStandardObject
}
export default api;