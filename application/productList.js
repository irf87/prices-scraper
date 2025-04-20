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

    /**
     * Get scraped products by list ID
     * @param {number} listId - The list ID
     * @returns {Array} Array of scraped products in the list
     */
    getScrapedProductsByListId(listId) {
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
                pl.list_id
            FROM product_scraped
            JOIN product ON product_scraped.product_id = product.id
            JOIN product_list pl ON product.id = pl.product_id
            JOIN (
                SELECT product_scraped_id, price, MAX(date) AS last_timestamp
                FROM product_scraped_snap
                GROUP BY product_scraped_id
            ) AS latest_snap ON product_scraped.id = latest_snap.product_scraped_id
            JOIN product_scraped_snap AS last_snap ON latest_snap.product_scraped_id = last_snap.product_scraped_id AND latest_snap.last_timestamp = last_snap.date
            WHERE pl.list_id = ${listId}
        `);
        return stmt.all();
    }
}

module.exports = new ProductList(); 