const express = require('express');
const router = express.Router();
const controller = require('./controller');

/**
 * @route GET /api/product-category
 * @desc Get all product-category assignments
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const assignments = await controller.getAllAssignments();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/product-category/product/:productId
 * @desc Get assignments by product ID
 * @access Public
 */
router.get('/product/:productId', async (req, res) => {
    try {
        const assignments = await controller.getAssignmentsByProduct(req.params.productId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /api/product-category/category/:categoryId
 * @desc Get assignments by category ID
 * @access Public
 */
router.get('/category/:categoryId', async (req, res) => {
    try {
        const assignments = await controller.getAssignmentsByCategory(req.params.categoryId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /api/product-category/assign
 * @desc Assign a product to a category
 * @access Public
 */
router.post('/assign', async (req, res) => {
    try {
        const assignment = await controller.assignProduct(req.body);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route DELETE /api/product-category/:productId/:categoryId
 * @desc Remove a product-category assignment
 * @access Public
 */
router.delete('/:productId/:categoryId', async (req, res) => {
    try {
        const result = await controller.removeAssignment(req.params.productId, req.params.categoryId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 