const express = require('express');
const router = express.Router();

//////////////////////////
/** MOVIE LOG ENDPOINTS */
//////////////////////////
const logRoutes = require('./gameLog');
router.use('/log', logRoutes);

///////////////////////////////
/** MOVIE BOOKMARK ENDPOINTS */
///////////////////////////////
const bookmarkRoutes = require('./gameBookmarks');
router.use('/bookmarks', bookmarkRoutes);

//////////////////////////
/** MOVIE LIST ENPOINTS */
//////////////////////////
const listRoutes = require('./gameLists');
router.use('/lists', listRoutes);

/** Export routes */
module.exports = router;