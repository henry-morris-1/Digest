const express = require('express');
const router = express.Router();

////////////////////////////////////
/** USER AUTHENTICATION ENDPOINTS */
////////////////////////////////////
const authRoutes = require('./auth/auth');
router.use('/', authRoutes);

//////////////////////
/** MOVIE ENDPOINTS */
//////////////////////
const movieRoutes = require('./movies/movies');
router.use('/movies', movieRoutes);

//////////////////////
/** MUSIC ENDPOINTS */
//////////////////////
const musicRoutes = require('./music/music');
router.use('/music', musicRoutes);

/////////////////////
/** GAME ENDPOINTS */
/////////////////////
const gameRoutes = require('./games/games');
router.use('/games', gameRoutes);

/** Export routes */
module.exports = router;