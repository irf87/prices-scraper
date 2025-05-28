const dbInstance = require('../infrastructure/storage/sqliteController');

class Lists {
    /**
     * Create a new list
     * @param {Object} list - The list object
     * @param {string} list.name - The name of the list
     * @param {string} list.description - The description of the list
     * @param {string} list.url_img_cover - The URL of the cover image
     * @returns {Object} The created list
     */
    create(list) {
        list.created_at = new Date().toISOString();
        list.updated_at = new Date().toISOString();
        const stmt = dbInstance.prepareInsert('lists', list);
        const result = stmt.run(...Object.values(list));
        return { id: result.lastInsertRowid, ...list };
    }

    /**
     * Get a list by its ID
     * @param {number} id - The list ID
     * @returns {Object|null} The list object or null if not found
     */
    getById(id) {
        const stmt = dbInstance.execute(`SELECT * FROM lists WHERE id = ${id}`);
        return stmt.get();
    }

    /**
     * Get all lists
     * @returns {Array} Array of list objects
     */
    getAll() {
        const stmt = dbInstance.execute('SELECT * FROM lists');
        return stmt.all();
    }

    /**
     * Update a list
     * @param {number} id - The list ID
     * @param {Object} list - The list data to update
     * @returns {boolean} Success status
     */
    update(id, list) {
        list.updated_at = new Date().toISOString();
        const stmt = dbInstance.prepareUpdate('lists', list, `id = ${id}`);
        const result = stmt.run(list.name, list.description, list.url_img_cover, list.updated_at, id);
        return result.changes > 0;
    }

    /**
     * Delete a list
     * @param {number} id - The list ID
     * @returns {boolean} Success status
     */
    delete(id) {
        const stmt = dbInstance.prepareDelete('lists', `id = ${id}`);
        const result = stmt.run(id);
        return result.changes > 0;
    }
}

module.exports = new Lists(); 