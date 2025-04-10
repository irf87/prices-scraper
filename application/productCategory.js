const dbInstance = require('../infrastructure/storage/sqliteController');

class ProductCategory {
    /**
     * Assign a product to a category
     * @param {Object} assignment - The assignment object
     * @param {number} assignment.product_id - The product ID
     * @param {number} assignment.category_id - The category ID
     * @returns {Object} The created assignment
     */
    create(assignment) {
        assignment.created_at = new Date().toISOString();
        assignment.updated_at = new Date().toISOString();
        const stmt = dbInstance.prepareInsert('product_category', assignment);
        const result = stmt.run(assignment.product_id, assignment.category_id, assignment.created_at, assignment.updated_at);
        return { id: result.lastInsertRowid, ...assignment };
    }

    /**
     * Get all product-category assignments
     * @returns {Array} Array of assignments
     */
    getAll() {
        const stmt = dbInstance.execute(`
            SELECT pc.*, p.name as product_name, c.name as category_name, c.description as category_description
            FROM product_category pc
            JOIN product p ON p.id = pc.product_id
            JOIN categories c ON c.id = pc.category_id
        `);
        return stmt.all();
    }

    /**
     * Get assignments by product ID
     * @param {number} productId - The product ID
     * @returns {Array} Array of assignments
     */
    getByProductId(productId) {
        const stmt = dbInstance.execute(`
            SELECT pc.*, p.name as product_name, c.name as category_name, c.description as category_description
            FROM product_category pc
            JOIN product p ON p.id = pc.product_id
            JOIN categories c ON c.id = pc.category_id
            WHERE pc.product_id = ${productId}
        `);
        return stmt.all();
    }

    /**
     * Get assignments by category ID
     * @param {number} categoryId - The category ID
     * @returns {Array} Array of assignments
     */
    getByCategoryId(categoryId) {
        const stmt = dbInstance.execute(`
            SELECT pc.*, p.name as product_name, c.name as category_name, c.description as category_description
            FROM product_category pc
            JOIN product p ON p.id = pc.product_id
            JOIN categories c ON c.id = pc.category_id
            WHERE pc.category_id = ${categoryId}
        `);
        return stmt.all();
    }

    /**
     * Delete a product-category assignment
     * @param {number} productId - The product ID
     * @param {number} categoryId - The category ID
     * @returns {boolean} True if the deletion was successful
     */
    delete(productId, categoryId) {
        const stmt = dbInstance.execute(
            `DELETE FROM product_category WHERE product_id = ${productId} AND category_id = ${categoryId}`
        );
        const result = stmt.run();
        return result.changes > 0;
    }

    /**
     * Check if an assignment exists
     * @param {number} productId - The product ID
     * @param {number} categoryId - The category ID
     * @returns {boolean} True if the assignment exists
     */
    exists(productId, categoryId) {
        const stmt = dbInstance.execute(
            `SELECT 1 FROM product_category WHERE product_id = ${productId} AND category_id = ${categoryId}`
        );
        return stmt.get() !== undefined;
    }
}

module.exports = new ProductCategory(); 