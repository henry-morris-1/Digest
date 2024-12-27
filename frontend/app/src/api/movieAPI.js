/** TMDb API key */
const KEY = 'api_key=6b47d56c8898b6dab300a0a4a020187e';

/** HTTP Client */
import HTTPClient from './HTTPClient';


/////////////////////////
/** LOGGED MOVIE CALLS */
/////////////////////////

/**
 * Get a list of movie objects
 * @returns List of logged movies
 */
const getLogItems = () => {
    const url = '/api/users/movies/log';
    return HTTPClient.get(url);
}

/**
 * Get a list of log object corresponding to the movie id
 * @param {Number} movieId Movie to retrieve logs for
 * @returns List of logs for the given movie
 */
const getLogsById = (movieId) => {
    const url = '/api/users/movies/log/' + movieId;
    return HTTPClient.get(url);
}

/**
 * Post a new movie log
 * @param {Object} movie Movie to log
 * @param {Object} log Movie log to post
 */
const createLog = (movie, log) => {
    log.movie = movie;
    const url = '/api/users/movies/log';
    return HTTPClient.post(url, log);
}

/**
 * Edits an existing movie log
 * @param {Number} logId Movie id to edit
 * @param {Object} movie Movie to log
 * @param {Object} log Movie log to insert
 */
const updateLog = (logId, movie, log) => {
    log.movie = movie;
    const url = '/api/users/movies/log/' + logId;
    return HTTPClient.put(url, log);
}

/**
 * Deletes and exising movie log
 * @param {Number} logId Log to delete
 */
const deleteLog = (logId) => {
    const url = '/api/users/movies/log/' + logId;
    return HTTPClient.delete(url);
}


///////////////////////////
/** BOOKMARK MOVIE CALLS */
///////////////////////////

/**
 * Get bookmarked movies
 * @returns Bookmarked movies
 */
const getBookmarks = () => {
    const url = '/api/users/movies/bookmarks';
    return HTTPClient.get(url);
}

/**
 * Checks if a movie is bookmarked
 * @param {Number} movieId Movie id to check for a bookmark
 * @returns True if bookmarked, false otherwise
 */
const isBookmarked = (movieId) => {
    const url = '/api/users/movies/bookmarks/' + movieId;
    return HTTPClient.get(url);
}

/**
 * Post a new movie bookmark
 * @param {Object} bookmark Movie bookmark to post
 */
const createBookmark = (bookmark) => {
    const url = '/api/users/movies/bookmarks';
    return HTTPClient.post(url, bookmark);
}

/**
 * Deletes and exising movie bookmark
 * @param {Number} movieId TMDb movie id to delete from bookmarks
 */
const deleteBookmark = (movieId) => {
    const url = '/api/users/movies/bookmarks/' + movieId;
    return HTTPClient.delete(url);
}


///////////////////////
/** MOVIE LIST CALLS */
///////////////////////

/**
 * Gets an array of movie lists created by the user
 * @param {Number} id User to get for
 */
const getLists = () => {
    const url = '/api/users/movies/lists';
    return HTTPClient.get(url);
}

/**
 * Post a new movie list
 * @param {String} title List title
 * @param {Object} movie Movie to add to the list
 */
const createList = (title, movie) => {
    const url = '/api/users/movies/lists';
    return HTTPClient.post(url, {title: title, movie: movie});
}

/**
 * Gets a specific movie list created by the user
 * @param {Number} listId List to get
 */
const getListById = (listId) => {
    const url = '/api/users/movies/lists/' + listId;
    return HTTPClient.get(url);
}

/**
 * Posts a movie into a user's list
 * @param {Number} listId List to post into
 * @param {Object} movie Movie to post
 */
const addToList = (listId, movie) => {
    const url = '/api/users/movies/lists/' + listId;
    return HTTPClient.post(url, movie);
}

/**
 * Puts a movie list
 * @param {Number} listId List to update
 * @param {String} title List title
 * @param {Array} movies List of movies
 */
const updateList = (listId, title, movies) => {
    const url = '/api/users/movies/lists/' + listId;
    return HTTPClient.put(url, {title: title, movies: movies});
}

/**
 * Delete a movie list
 * @param {Number} listId List to delete
 */
const deleteList = (listId) => {
    const url = '/api/users/movies/lists/' + listId;
    return HTTPClient.delete(url);
}


/////////////////////
/** TMDB API CALLS */
/////////////////////

/**
 * Makes a fetch request for a movie from TMDb
 * @param {Number} id Movie id (per TMDb)
 * @returns Movie data
 */
const getById = (id) => {
    const url = 'https://api.themoviedb.org/3/movie/' + id + '?&append_to_response=credits&' + KEY;
    return HTTPClient.get(url);
}

/**
 * Gets search results for a movie query from TMDb
 * @param {String} query Search query
 * @returns Search data
 */
const getSearch = (query) => {
    const url = 'https://api.themoviedb.org/3/search/movie?query=' + encodeURIComponent(query) + '&' + KEY;
    return HTTPClient.get(url).then(response => {
        return response.results;
    });
}

/**
 * Creates an object with all necessary fields from an object obtained from the
 * TMDb API.
 * @param {Object} movie TMDb API movie object
 * @returns New object with standardized fields
 */
const toStandardObject = (movie) => {
    return returnPromise()
        .then(() => {
            // Check whether another API call needs to be made to find the
            // credits, which include the directors
            if (!movie.credits) {
                return getById(movie.id).then(newMovie => {
                    movie = newMovie;
                    return;
                });
            } else {
                return;
            }
        })
        .then(() => {
            // Get the directors as a comma-separated list
            let director = '';
            for (let index in movie.credits.crew) {
                let credit = movie.credits.crew[index];
                if (credit.job === 'Director') {
                    if (director.length === 0) {
                        director += credit.name;
                    } else {
                        director += ', ' + credit.name;
                    }
                }
            }
            return director;
        })
        .then((director) => {
            // Assemble and return the object
            const obj = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                creators: director,
                year: movie.release_date.substring(0, 4),
                runtime: movie.runtime,
                summary: movie.overview
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