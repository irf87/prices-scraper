const productCategory = require('../../application/productCategory');

class ProductCategoryController {
    /**
     * Get all product-category assignments
     * @returns {Promise<Array>} Array of assignments
     */
    async getAllAssignments() {
        try {
            return await productCategory.getAll();
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
            return await productCategory.getByProductId(productId);
        } catch (error) {
            throw new Error('Error getting product assignments: ' + error.message);
        }
    }

    /**
     * Get assignments by category ID
     * @param {number} categoryId - Category ID
     * @returns {Promise<Array>} Array of assignments
     */
    async getAssignmentsByCategory(categoryId) {
        try {
            return await productCategory.getByCategoryId(categoryId);
        } catch (error) {
            throw new Error('Error getting category assignments: ' + error.message);
        }
    }

    /**
     * Assign a product to a category
     * @param {Object} assignment - Assignment data
     * @returns {Promise<Object>} Created assignment
     */
    async assignProduct(assignment) {
        try {
            if (!assignment.product_id || !assignment.category_id) {
                throw new Error('Product ID and Category ID are required');
            }

            if (await productCategory.exists(assignment.product_id, assignment.category_id)) {
                throw new Error('Assignment already exists');
            }

            return await productCategory.create(assignment);
        } catch (error) {
            throw new Error('Error assigning product: ' + error.message);
        }
    }

    /**
     * Remove a product-category assignment
     * @param {number} productId - Product ID
     * @param {number} categoryId - Category ID
     * @returns {Promise<boolean>} Success status
     */
    async removeAssignment(productId, categoryId) {
        try {
            const success = await productCategory.delete(productId, categoryId);
            if (!success) {
                throw new Error('Assignment not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error('Error removing assignment: ' + error.message);
        }
    }
}

module.exports = new ProductCategoryController(); 