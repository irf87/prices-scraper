const productList = require('../../application/productList');

class ProductListController {
    /**
     * Get all product-list assignments
     * @returns {Promise<Array>} Array of assignments
     */
    async getAllAssignments() {
        try {
            return await productList.getAll();
        } catch (error) {
            throw new Error('Error getting assignments: ' + error.message);
        }
    }

    /**
     * Get assignments by product ID
     * @param {number} productId - Product ID
     * @returns {Promise<Array>} Array of assignments
     */
    async getAssignmentsByProduct(productId) {
        try {
            return await productList.getByProductId(productId);
        } catch (error) {
            throw new Error('Error getting product assignments: ' + error.message);
        }
    }

    /**
     * Get assignments by list ID
     * @param {number} listId - List ID
     * @returns {Promise<Array>} Array of assignments
     */
    async getAssignmentsByList(listId) {
        try {
            return await productList.getByListId(listId);
        } catch (error) {
            throw new Error('Error getting list assignments: ' + error.message);
        }
    }

    /**
     * Assign a product to a list
     * @param {Object} assignment - Assignment data
     * @returns {Promise<Object>} Created assignment
     */
    async assignProduct(assignment) {
        try {
            if (!assignment.product_id || !assignment.list_id) {
                throw new Error('Product ID and List ID are required');
            }

            if (await productList.exists(assignment.product_id, assignment.list_id)) {
                throw new Error('Assignment already exists');
            }

            return await productList.create(assignment);
        } catch (error) {
            throw new Error('Error assigning product: ' + error.message);
        }
    }

    /**
     * Remove a product from a list
     * @param {number} productId - Product ID
     * @param {number} listId - List ID
     * @returns {Promise<boolean>} Success status
     */
    async removeProduct(productId, listId) {
        try {
            const success = await productList.delete(productId, listId);
            if (!success) {
                throw new Error('Assignment not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error('Error removing product: ' + error.message);
        }
    }

    /**
     * Get scraped products by list ID
     * @param {number} listId - List ID
     * @returns {Promise<Array>} Array of scraped products in the list
     */
    async getScrapedProductsByList(listId) {
        try {
            return await productList.getScrapedProductsByListId(listId);
        } catch (error) {
            throw new Error('Error getting scraped products by list: ' + error.message);
        }
    }
}

module.exports = new ProductListController(); 