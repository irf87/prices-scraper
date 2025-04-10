const express = require('express');
const router = express.Router();
const controller = require('./controller');

/**
 * @route GET /api/categories
 * @desc Get all categories
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const categories = await controller.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/categories/:id
 * @desc Get a category by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await controller.getCategory(req.params.id);
        res.json(category);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Public
 */
router.post('/', async (req, res) => {
    try {
        const category = await controller.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route PUT /api/categories/:id
 * @desc Update a category
 * @access Public
 */
router.put('/:id', async (req, res) => {
    try {
        const result = await controller.updateCategory(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category
 * @access Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const result = await controller.deleteCategory(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

