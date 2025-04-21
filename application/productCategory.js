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

    /**
     * Get scraped products by category ID
     * @param {number} categoryId - The category ID
     * @returns {Array} Array of scraped products in the category
     */
    getScrapedProductsByCategoryId(categoryId) {
        const stmt = dbInstance.execute(`
            SELECT 
                product.id,
                product_scraped.id as product_scraped_id,
                product.name, 
                product.description,
                product.url_info, 
                product.url_img, 
                product_scraped.url_to_scrape, 
                last_snap.price, 
                last_snap.date,
                pc.category_id,
                CASE WHEN product_scraped.enable = 1 THEN true ELSE false END as enable
            FROM product_scraped
            JOIN product ON product_scraped.product_id = product.id
            JOIN product_category pc ON product.id = pc.product_id
            JOIN (
                SELECT product_scraped_id, price, MAX(date) AS last_timestamp
                FROM product_scraped_snap
                GROUP BY product_scraped_id
            ) AS latest_snap ON product_scraped.id = latest_snap.product_scraped_id
            JOIN product_scraped_snap AS last_snap ON latest_snap.product_scraped_id = last_snap.product_scraped_id AND latest_snap.last_timestamp = last_snap.date
            WHERE pc.category_id = ${categoryId}
        `);
        const results = stmt.all();
        return results.map(item => ({
            ...item,
            enable: Boolean(item.enable)
        }));
    }
}

module.exports = new ProductCategory(); 