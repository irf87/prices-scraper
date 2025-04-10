const dbInstance = require('../infrastructure/storage/sqliteController');

class Categories {
    /**
     * Create a new category
     * @param {Object} category - The category object
     * @param {string} category.name - The name of the category
     * @param {string} category.description - The description of the category
     * @returns {Object} The created category
     */
    create(category) {
        category.created_at = new Date().toISOString();
        category.updated_at = new Date().toISOString();
        const stmt = dbInstance.prepareInsert('categories', category);
        const result = stmt.run(category.name, category.description, category.created_at, category.updated_at);
        return { id: result.lastInsertRowid, ...category };
    }

    /**
     * Get a category by its ID
     * @param {number} id - The category ID
     * @returns {Object|null} The category object or null if not found
     */
    getById(id) {
        const stmt = dbInstance.execute(`SELECT * FROM categories WHERE id = ${id}`);
        return stmt.get();
    }

    /**
     * Get all categories
     * @returns {Array} Array of category objects
     */
    getAll() {
        const stmt = dbInstance.execute('SELECT * FROM categories');
        return stmt.all();
    }

    /**
     * Update a category
     * @param {number} id - The category ID
     * @param {Object} category - The category data to update
     * @returns {boolean} True if the update was successful
     */
    update(id, category) {
        category.updated_at = new Date().toISOString();
        const stmt = dbInstance.prepareUpdate('categories', category, `id = ${id}`);
        const result = stmt.run();
        return result.changes > 0;
    }

    /**
     * Delete a category
     * @param {number} id - The category ID
     * @returns {boolean} True if the deletion was successful
     */
    delete(id) {
        const stmt = dbInstance.execute(`DELETE FROM categories WHERE id = ${id}`);
        const result = stmt.run();
        return result.changes > 0;
    }
}

module.exports = new Categories();