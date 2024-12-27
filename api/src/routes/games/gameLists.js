const express = require('express');
const cookieParser = require('cookie-parser');

/** Import token middleware */
const { TokenMiddleware } = require('../../middleware/TokenMiddleware');

const router = express.Router();
router.use(cookieParser());
router.use(TokenMiddleware);

/** Import list DAO */
const ListDAO = require('../../db/GameDAOs/GameListDAO');

/**
 * Get a user's lists
 */
router.get('/', (req, res) => {
    const userId = req.user.id;

    ListDAO.getLists(userId).then(lists => {
        if (lists) {
            res.status(200).json(lists);
        } else {
            res.status(404).json({ error: 'Lists not found' });
        }
    });
});

/**
 * Gets a user's specific list
 */
router.get('/:listId', (req, res) => {
    const userId = req.user.id;
    const listId = req.params.listId;

    ListDAO.getListById(userId, listId).then(list => {
        if (list) {
            res.status(200).json(list);
        } else {
            res.status(404).json({ error: 'List not found' });
        }
    });
});

/**
 * Create a list
 */
router.post('/', (req, res) => {
    const userId = req.user.id;
    const list = req.body;

    ListDAO.createList(userId, list).then(lists => {
        res.status(200).json(lists);
    });
});

/**
 * Add a game to a list
 */
router.post('/:listId', (req, res) => {
    const userId = req.user.id;
    const listId = req.params.listId;
    const game = req.body;

    ListDAO.addGameToList(userId, listId, game).then(lists => {
        res.status(200).json(lists);
    });
})

/**
 * Edit a list
 */
router.put('/:listId', (req, res) => {
    const userId = req.user.id;
    const listId = req.params.listId;
    const list = req.body;

    ListDAO.editList(userId, listId, list).then(lists => {
        res.status(200).json(lists);
    });
});

/**
 * Delete a list
 */
router.delete('/:listId', (req, res) => {
    const userId = req.user.id;
    const listId = parseInt(req.params.listId);

    ListDAO.deleteList(userId, listId).then(lists => {
        res.status(200).json(lists);
    });
});

module.exports = router;