const categories = require('../../application/categories');

class CategoriesController {
    /**
     * Get all categories
     * @returns {Promise<Array>} Array of categories
     */
    async getCategories() {
        try {
            return await categories.getAll();
        } catch (error) {
            throw new Error('Error getting categories: ' + error.message);
        }
    }

    /**
     * Get a category by ID
     * @param {number} id - Category ID
     * @returns {Promise<Object>} Category object
     */
    async getCategory(id) {
        try {
            const category = await categories.getById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            throw new Error('Error getting category: ' + error.message);
        }
    }

    /**
     * Create a new category
     * @param {Object} categoryData - Category data
     * @returns {Promise<Object>} Created category
     */
    async createCategory(categoryData) {
      console.log(categoryData);
        try {
            if (!categoryData.name) {
                throw new Error('Category name is required');
            }
            return await categories.create(categoryData);
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    /**
     * Update a category
     * @param {number} id - Category ID
     * @param {Object} categoryData - Category data to update
     * @returns {Promise<boolean>} Success status
     */
    async updateCategory(id, categoryData) {
        try {
            if (!categoryData.name) {
                throw new Error('Category name is required');
            }
            const success = await categories.update(id, categoryData);
            if (!success) {
                throw new Error('Category not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }

    /**
     * Delete a category
     * @param {number} id - Category ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteCategory(id) {
        try {
            const success = await categories.delete(id);
            if (!success) {
                throw new Error('Category not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
}

module.exports = new CategoriesController();
