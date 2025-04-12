const dbInstance = require('../infrastructure/storage/sqliteController');

class ProductList {
    /**
     * Create a new product-list assignment
     * @param {Object} assignment - The assignment object
     * @param {number} assignment.product_id - The product ID
     * @param {number} assignment.list_id - The list ID
     * @returns {Object} The created assignment
     */
    create(assignment) {
        assignment.created_at = new Date().toISOString();
        assignment.updated_at = new Date().toISOString();
        const stmt = dbInstance.prepareInsert('product_list', assignment);
        const result = stmt.run(assignment.product_id, assignment.list_id, assignment.created_at, assignment.updated_at);
        return { product_id: assignment.product_id, list_id: assignment.list_id, ...assignment };
    }

    /**
     * Get all product-list assignments
     * @returns {Array} Array of assignment objects
     */
    getAll() {
        const stmt = dbInstance.execute(`
            SELECT pl.*, p.name as product_name, l.name as list_name 
            FROM product_list pl
            JOIN product p ON pl.product_id = p.id
            JOIN lists l ON pl.list_id = l.id
        `);
        return stmt.all();
    }

    /**
     * Get assignments by product ID
     * @param {number} productId - The product ID
     * @returns {Array} Array of assignment objects
     */
    getByProductId(productId) {
        const stmt = dbInstance.execute(`
            SELECT pl.*, p.name as product_name, l.name as list_name 
            FROM product_list pl
            JOIN product p ON pl.product_id = p.id
            JOIN lists l ON pl.list_id = l.id
            WHERE pl.product_id = ${productId}
        `);
        return stmt.all();
    }

    /**
     * Get assignments by list ID
     * @param {number} listId - The list ID
     * @returns {Array} Array of assignment objects
     */
    getByListId(listId) {
        const stmt = dbInstance.execute(`
            SELECT pl.*, p.name as product_name, l.name as list_name 
            FROM product_list pl
            JOIN product p ON pl.product_id = p.id
            JOIN lists l ON pl.list_id = l.id
            WHERE pl.list_id = ${listId}
        `);
        return stmt.all();
    }

    /**
     * Check if an assignment exists
     * @param {number} productId - The product ID
     * @param {number} listId - The list ID
     * @returns {boolean} Whether the assignment exists
     */
    exists(productId, listId) {
        const stmt = dbInstance.execute(`
            SELECT COUNT(*) as count 
            FROM product_list 
            WHERE product_id = ${productId} AND list_id = ${listId}
        `);
        return stmt.get().count > 0;
    }

    /**
     * Delete a product-list assignment
     * @param {number} productId - The product ID
     * @param {number} listId - The list ID
     * @returns {boolean} Success status
     */
    delete(productId, listId) {
        const stmt = dbInstance.prepareDelete('product_list', `product_id = ${productId} AND list_id = ${listId}`);
        const result = stmt.run(productId, listId);
        return result.changes > 0;
    }
}

module.exports = new ProductList(); 