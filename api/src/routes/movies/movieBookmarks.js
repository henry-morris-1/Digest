const express = require('express');
const cookieParser = require('cookie-parser');

/** Import token middleware */
const { TokenMiddleware } = require('../../middleware/TokenMiddleware');

const router = express.Router();
router.use(cookieParser());
router.use(TokenMiddleware);

/** Import bookmark DAO */
const BookmarkDAO = require('../../db/MovieDAOs/MovieBookmarkDAO');

/**
 * Get a user's bookmarks
 */
router.get('/', (req, res) => {
    const userId = req.user.id;

    BookmarkDAO.getBookmarks(userId).then(bookmarks => {
        if (bookmarks) {
            res.status(200).json(bookmarks);
        } else {
            res.status(404).json({ error: 'Bookmarks not found' });
        }
    });
});

/**
 * Checks if a user bookmarked the given movie
 */
router.get('/:movieId', (req, res) => {
    const userId = req.user.id;
    const movieId = req.params.movieId;

    BookmarkDAO.isBookmarked(userId, movieId).then(bookmarked => {
        if (bookmarked) {
            res.status(200).json({ bookmarked: true });
        } else {
            res.status(200).json({ bookmarked: false });
        }
    });
});

/**
 * Create a bookmark
 */
router.post('/', (req, res) => {
    const userId = req.user.id;
    const movie = req.body;

    BookmarkDAO.createBookmark(userId, movie).then(bookmarks => {
        res.status(200).json(bookmarks);
    });
});

/**
 * Delete a bookmark
 */
router.delete('/:movieId', (req, res) => {
    const userId = req.user.id;
    const movieId = req.params.movieId;

    BookmarkDAO.deleteBookmark(userId, movieId).then(bookmarks => {
        res.status(200).json(bookmarks);
    })
});

module.exports = router;