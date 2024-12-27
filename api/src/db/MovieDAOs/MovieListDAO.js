const db = require('../DBConnection');
const List = require('../models/movies/List');
const Movie = require('../models/movies/Movie');

function getLists (id) {
    return db.query('SELECT list_id, title FROM movie_lists WHERE user_id_fk = ?', [id]).then(({results}) => {
        // Get the list details for each list from the user
        const lists = results.map(list => new List(list));

        // Create a list of promises for getting the movies for each list
        const promises = [];
        
        // Call the database to get the movies for each list
        lists.forEach(list => {
            promises.push(db.query('SELECT list_index, movie_id, movie_title, movie_poster FROM movie_list_items INNER JOIN movies ON movie_list_items.movie_id_fk = movies.movie_id AND movie_list_items.list_id_fk = ? ORDER BY movie_list_items.list_index', [list.id]).then(({results}) => {
                list.movies = results.map(movie => new Movie(movie));
            }));
        });

        // Return the lists when all promises are resolved
        return Promise.all(promises).then(() => {
            return lists;
        });
    });
}

function getListById (userId, listId) {
    return db.query('SELECT * FROM movie_lists WHERE user_id_fk = ? AND list_id = ?', [userId, listId]).then(({results}) => {
        // Get the first result
        const list = results.map(list => new List(list))[0];

        // Get the movies for the list, then return
        return db.query('SELECT list_index, movie_id, movie_title, movie_poster FROM movie_list_items INNER JOIN movies ON movie_list_items.movie_id_fk = movies.movie_id AND movie_list_items.list_id_fk = ? ORDER BY movie_list_items.list_index', [listId])
            .then(({results}) => {
                list.movies = results.map(movie => new Movie(movie));
            })
            .then(() => {
                return list;
            });
    });
}

function createList (userId, list) {
    const title = list.title;
    const movieId = list.movie.id;
    const movieTitle = list.movie.title;
    const moviePoster = list.movie.poster_path;

    return db.query('INSERT INTO movie_lists (user_id_fk, title) VALUES (?, ?); SET @ListID = LAST_INSERT_ID(); INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES (?, ?, ?); INSERT INTO movie_list_items (list_id_fk, list_index, movie_id_fk) VALUES (@ListID, 1, ?);', [userId, title, movieId, movieTitle, moviePoster, movieId]).then(() => {
        return getLists(userId);
    });
}

function addMovieToList (userId, listId, movie) {
    return db.query('SET @NewIndex = (SELECT MAX(list_index) FROM movie_list_items WHERE list_id_fk = ?) + 1; INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES (?, ?, ?); INSERT INTO movie_list_items (list_id_fk, list_index, movie_id_fk) VALUES (?, @NewIndex, ?);', [listId, movie.id, movie.title, movie.poster_path, listId, movie.id]).then(() => {
        return getLists(userId);
    });
}

function editList (userId, listId, list) {
    // Update the list title, then delete all existing list items
    return db.query('UPDATE movie_lists SET title = ? WHERE user_id_fk = ? AND list_id = ?; DELETE FROM movie_list_items WHERE list_id_fk = ?;', [list.title, userId, listId, listId]).then(() => {
        // Create a list of promises for adding the movies in the list
        const promises = [];

        // For each movie in the updated list, add it back in
        list.movies.map((movie, index) => {
            promises.push(db.query('INSERT IGNORE INTO movies (movie_id, movie_title, movie_poster) VALUES (?, ?, ?); INSERT INTO movie_list_items (list_id_fk, list_index, movie_id_fk) VALUES (?, ?, ?);', [movie.id, movie.title, movie.poster_path, listId, index, movie.id]));
        });

        // Return when all promises have been resolved
        return Promise.all(promises).then(() => {
            return getLists(userId);
        });
    });
}

function deleteList (userId, listId) {
    return db.query('DELETE FROM movie_list_items WHERE list_id_fk = ?; DELETE FROM movie_lists WHERE user_id_fk = ? AND list_id = ?;', [listId, userId, listId]).then(() => {
        return getLists(userId);
    });
}

module.exports = {
    getLists: getLists,
    getListById: getListById,
    createList: createList,
    addMovieToList: addMovieToList,
    editList: editList,
    deleteList: deleteList
}