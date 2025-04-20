const express = require('express');
const router = express.Router();
const controller = require('./controller');

const parseParams = require('../../middleware/parseParams');
router.use(parseParams);

/**
 * @route GET /api/product-list
 * @desc Get all product-list assignments
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const assignments = await controller.getAllAssignments();
        res.status(200).send(assignments);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @route GET /api/product-list/product/:productId
 * @desc Get assignments by product ID
 * @access Public
 */
router.get('/product/:productId', async (req, res) => {
    try {
        const assignments = await controller.getAssignmentsByProduct(req.params.productId);
        res.status(200).send(assignments);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @route GET /api/product-list/list/:listId
 * @desc Get assignments by list ID
 * @access Public
 */
router.get('/list/:listId', async (req, res) => {
    try {
        const assignments = await controller.getAssignmentsByList(req.params.listId);
        res.status(200).send(assignments);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @route POST /api/product-list/assign
 * @desc Assign a product to a list
 * @access Public
 */
router.post('/assign', async (req, res) => {
    try {
        const assignment = await controller.assignProduct(req.body);
        res.status(200).send(assignment);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

/**
 * @route DELETE /api/product-list/:productId/:listId
 * @desc Remove a product from a list
 * @access Public
 */
router.delete('/:productId/:listId', async (req, res) => {
    try {
        const result = await controller.removeProduct(req.params.productId, req.params.listId);
        res.send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

/**
 * @route GET /api/product-list/scraped-product/:listId
 * @desc Get scraped products by list ID
 * @access Public
 */
router.get('/scraped-product/:listId', async (req, res) => {
    try {
        const products = await controller.getScrapedProductsByList(req.params.listId);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

/**
 * @route GET /api/product-list/scraped-product/:categoryId
 * @desc Get scraped products by category ID
 * @access Public
 */
router.get('/scraped-product/:categoryId', async (req, res) => {
    try {
        const products = await controller.getScrapedProductsByCategory(req.params.categoryId);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router; 