const express = require('express');
const router = express.Router();
const controller = require('./controller');

const parseParams = require('../../middleware/parseParams');

router.use(parseParams);

/**
 * @route GET /api/lists
 * @desc Get all lists
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const lists = await controller.getLists();
        res.status(200).send(lists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/lists/:id
 * @desc Get a list by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        const list = await controller.getList(req.params.id);
        res.status(200).send(list);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @route POST /api/lists
 * @desc Create a new list
 * @access Public
 */
router.post('/', async (req, res) => {
    try {
        const list = await controller.createList(req.body);
        res.status(201).send(list);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

/**
 * @route PUT /api/lists/:id
 * @desc Update a list
 * @access Public
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await controller.updateList(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/lists/:id
 * @desc Delete a list
 * @access Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await controller.deleteList(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 