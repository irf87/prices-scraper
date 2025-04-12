const lists = require('../../application/lists');

class ListsController {
    /**
     * Get all lists
     * @returns {Promise<Array>} Array of lists
     */
    async getLists() {
        try {
            return await lists.getAll();
        } catch (error) {
            throw new Error('Error getting lists: ' + error.message);
        }
    }

    /**
     * Get a list by ID
     * @param {number} id - List ID
     * @returns {Promise<Object>} List object
     */
    async getList(id) {
        try {
            const list = await lists.getById(id);
            if (!list) {
                throw new Error('List not found');
            }
            return list;
        } catch (error) {
            throw new Error('Error getting list: ' + error.message);
        }
    }

    /**
     * Create a new list
     * @param {Object} listData - List data
     * @returns {Promise<Object>} Created list
     */
    async createList(listData) {
        try {
            if (!listData.name) {
                throw new Error('List name is required');
            }
            return await lists.create(listData);
        } catch (error) {
            throw new Error('Error creating list: ' + error.message);
        }
    }

    /**
     * Update a list
     * @param {number} id - List ID
     * @param {Object} listData - List data to update
     * @returns {Promise<boolean>} Success status
     */
    async updateList(id, listData) {
        try {
            if (!listData.name) {
                throw new Error('List name is required');
            }
            const success = await lists.update(id, listData);
            if (!success) {
                throw new Error('List not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error('Error updating list: ' + error.message);
        }
    }

    /**
     * Delete a list
     * @param {number} id - List ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteList(id) {
        try {
            const success = await lists.delete(id);
            if (!success) {
                throw new Error('List not found');
            }
            return { success: true };
        } catch (error) {
            throw new Error('Error deleting list: ' + error.message);
        }
    }
}

module.exports = new ListsController(); 