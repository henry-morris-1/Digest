/** Last.fm API Key */
const KEY = 'f0912b50b6d5d4c17024501657fcb4cb';

/** HTTP Client */
import HTTPClient from './HTTPClient';


/////////////////////////
/** LOGGED ALBUM CALLS */
/////////////////////////

/**
 * Get a list of album objects corresponding to the log
 * @returns List of logged albums
 */
const getLogItems = () => {
    const url = '/api/users/music/log';
    return HTTPClient.get(url);
}

/**
 * Get a list of log object corresponding to the album id
 * @param {Number} albumId Album to retrieve logs for
 * @returns List of logs for the given album
 */
const getLogsById = (albumId) => {
    const url = '/api/users/music/log/' + albumId;
    return HTTPClient.get(url);
}

/**
 * Post a new album log
 * @param {Object} album Album to log
 * @param {Object} log Album log to post
 */
const createLog = (album, log) => {
    log.album = album;
    const url = '/api/users/music/log';
    return HTTPClient.post(url, log);
}

/**
 * Edits an existing album log
 * @param {Number} logId Log to edit
 * @param {Object} Album Album to log
 * @param {Object} log Album log to insert
 */
const updateLog = (logId, album, log) => {
    log.album = album;
    const url = '/api/users/music/log/' + logId;
    return HTTPClient.put(url, log);
}

/**
 * Deletes and exising album log
 * @param {Number} logId Log to delete
 */
const deleteLog = (logId) => {
    const url = '/api/users/music/log/' + logId;

    return HTTPClient.delete(url);
}


///////////////////////////
/** BOOKMARK ALBUM CALLS */
///////////////////////////

/**
 * Get bookmarked albums
 * @returns Bookmarked albums for the given user
 */
const getBookmarks = () => {
    // Get the url of bookmarked albums
    const url = '/api/users/music/bookmarks';
    return HTTPClient.get(url);
}

/**
 * Checks if an album is bookmarked
 * @param {Number} albumId Album id to check for a bookmark
 * @returns True if bookmarked, false otherwise
 */
const isBookmarked = (albumId) => {
    const url = '/api/users/music/bookmarks/' + albumId;
    return HTTPClient.get(url);
}

/**
 * Post a new album bookmark
 * @param {Object} bookmark Album bookmark to post
 */
const createBookmark = (bookmark) => {
    const url = '/api/users/music/bookmarks';
    return HTTPClient.post(url, bookmark);
}

/**
 * Deletes and exising album bookmark
 * @param {Number} albumId Album id to delete from bookmarks
 */
const deleteBookmark = (albumId) => {
    const url = '/api/users/music/bookmarks/' + albumId;
    return HTTPClient.delete(url);
}


///////////////////////
/** ALBUM LIST CALLS */
///////////////////////

/**
 * Gets an array of album lists created by the user
 */
const getLists = () => {
    const url = '/api/users/music/lists';
    return HTTPClient.get(url);
}

/**
 * Post a new album list
 * @param {String} title List title
 * @param {Object} album Album to add
 */
const createList = (title, album) => {
    const url = '/api/users/music/lists';
    return HTTPClient.post(url, {title: title, album: album});
}

/**
 * Gets a specific album list created by the user
 * @param {Number} listId List to get
 */
const getListById = (listId) => {
    const url = '/api/users/music/lists/' + listId;
    return HTTPClient.get(url);
}

/**
 * Posts a album into a user's list
 * @param {Number} listId List to post into
 * @param {Object} album Album to post
 */
const addToList = (listId, album) => {
    const url = '/api/users/music/lists/' + listId;
    return HTTPClient.post(url, album);
}

/**
 * Puts a album list
 * @param {Number} listId List to put into
 * @param {String} title List title
 * @param {Object} albums List albums
 */
const updateList = (listId, title, albums) => {
    const url = '/api/users/music/lists/' + listId;
    return HTTPClient.put(url, {title: title, albums: albums});
}

/**
 * Delete a album list
 * @param {Number} listId List to delete
 */
const deleteList = (listId) => {
    const url = '/api/users/music/lists/' + listId;
    return HTTPClient.delete(url);
}


////////////////////////
/** LAST.FM API CALLS */
////////////////////////

/**
 * Makes a fetch request for an album from Last.fm
 * @param {String} id Album id (per musicbrainz)
 * @returns Album data
 */
const getById = (id) => {
    const url = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + KEY + '&mbid=' + id + '&format=json';
    return HTTPClient.get(url).then(response => {
        return response.album;
    });
}

/**
 * Gets search results for an album query from Last.fm
 * @param {String} query Search query
 * @returns Search data
 */
const getSearch = (query) => {
    const url = 'https://ws.audioscrobbler.com/2.0/?method=album.search&album=' + encodeURIComponent(query) + '&api_key=' + KEY + '&format=json';
    return HTTPClient.get(url).then(response => {
        return response.results.albummatches.album;
    });
}

/**
 * Creates an object with all necessary fields from an object obtained from the
 * LastFM and Musicbrainz APIs.
 * @param {Object} album LastFM API album object
 * @returns New object with standardized fields
 */
const toStandardObject = (album) => {
    if (album['wiki']) {
        return standardizeAlbumPage(album);
    } else {
        return standardizeSearchResult(album);
    }
}

/**
 * Create a standardized object for an album page
 * @param {Object} album Album to standardize
 */
function standardizeAlbumPage(album) {
    let obj = {};

    return returnPromise()
        .then(() => {
            // Fill in as much data as possible
            obj.id = window.location.href.split('/').slice(-1).pop();
            obj.title = album['name'];
            obj.poster_path = album.image[3]['#text'];
            obj.creators = album.artist;
            obj.year = '';
            obj.runtime = getRuntime(album.tracks);
            obj.summary = album.wiki && formatSummary(album.wiki.content);
        })
        .then(() => {
            // Get the release year from Musicbrainz
            return musicbrainzAlbumData(obj.id).then(response => {
                obj.year = response.date.substring(0, 4);
            });
        })
        .then(() => {
            return obj;
        });
}

/**
 * Create a standardized object for a search result
 * @param {Object} album Album to standardize
 */
function standardizeSearchResult(album) {
    let obj = {};

    return returnPromise()
        .then(() => {
            // Fill in as much data as possible
            obj.id = album['mbid'];
            obj.title = album['name'];
            obj.poster_path = album.image[3]['#text'];
            obj.creators = album.artist;
            obj.year = '';
            obj.runtime = '';
            obj.summary = '';
        })
        .then(() => {
            // Get the full album info from LastFM
            return lastFmAlbumData(obj.creators, obj.title).then(response => {
                // Fill in the mbid if needed
                if (!obj.id) {
                    obj.id = response['mbid'];
                }
                
                // Get the summary, if it exists
                obj.summary = response.wiki && formatSummary(response.wiki.summary);
                return;
            });
        })
        .then(() => {
            return obj;
        });
}

/**
 * Makes an API call to LastFM to find an album by its artist and title
 * @param {String} artist Artist name
 * @param {String} title Album title
 * @returns LastFM data for a matching album
 */
function lastFmAlbumData (artist, title) {
    const url = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=' + KEY + '&artist=' + artist + '&album=' + title + '&format=json';
    return HTTPClient.get(url).then(response => {
        return response.album;
    });
}

/**
 * Makes an API call to Musicbrainz to find an album's data
 * @param {String} id Musicbrainz id
 * @returns Musicbrainz data for the corresponding album
 */
const musicbrainzAlbumData = (id) => {
    const url = 'https://musicbrainz.org/ws/2/release/' + id + '?inc=artist-credits&fmt=json';
    return HTTPClient.get(url);
}

/**
 * Formats a LastFM summary to remove its HTML formatting
 * @param {String} summary Album summary
 * @returns Summary without HTML formatting
 */
function formatSummary (summary) {
    summary = JSON.stringify(summary);
    summary = summary.replaceAll(/\\n/g, ' ');
    summary = summary.replaceAll(/\\/g, '');
    summary = summary.replace(/^"/g, '');
    summary = summary.replace(/<.*$/g, '');
    return summary;
}

/**
 * Calculates the runtime, in minutes, for all tracks combined
 * @param {Array} tracks Array of album tracks
 * @returns Total album runtime
 */
function getRuntime (tracks) {
    let runtime = 0;
    for (let track of tracks.track) {
        runtime += parseInt(track['duration']);
    }
    return Math.floor(runtime / 60);
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