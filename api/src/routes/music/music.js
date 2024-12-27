const express = require('express');
const router = express.Router();

//////////////////////////
/** MUSIC LOG ENDPOINTS */
//////////////////////////
const logRoutes = require('./musicLog');
router.use('/log', logRoutes);

///////////////////////////////
/** MUSIC BOOKMARK ENDPOINTS */
///////////////////////////////
const bookmarkRoutes = require('./musicBookmarks');
router.use('/bookmarks', bookmarkRoutes);

//////////////////////////
/** MUSIC LIST ENPOINTS */
//////////////////////////
const listRoutes = require('./musicLists');
router.use('/lists', listRoutes);

/** Export routes */
module.exports = router;