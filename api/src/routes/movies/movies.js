const express = require('express');
const router = express.Router();

//////////////////////////
/** MOVIE LOG ENDPOINTS */
//////////////////////////
const logRoutes = require('./movieLog');
router.use('/log', logRoutes);

///////////////////////////////
/** MOVIE BOOKMARK ENDPOINTS */
///////////////////////////////
const bookmarkRoutes = require('./movieBookmarks');
router.use('/bookmarks', bookmarkRoutes);

//////////////////////////
/** MOVIE LIST ENPOINTS */
//////////////////////////
const listRoutes = require('./movieLists');
router.use('/lists', listRoutes);

/** Export routes */
module.exports = router;