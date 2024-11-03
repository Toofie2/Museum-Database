const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all product caategories
router.get('/', (req, res) => {
    db.query('SELECT * FROM Product_Category WHERE is_deleted = FALSE', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET Product Category by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Product_Category WHERE product_category_id = ? AND is_deleted = FALSE', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Product Category not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new Product Category
router.post('/', (req, res) => {
    const { name, image_path } = req.body;
        const insertQuery = 'INSERT INTO Product_Category(name, image_path) VALUES (?, ?)';
        db.query(insertQuery, [name, image_path], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    });

// Update Product Category by ID
router.put('/:id', (req, res) => {
    const productCategoryId = req.params.id; // The product category ID from the URL params
    const updates = req.body; // The updates from the request body

    // Fetch the current product category data
    const fetchQuery = 'SELECT * FROM Product_Category WHERE product_category_id = ?';
    db.query(fetchQuery, [productCategoryId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Product Category not found' });
        }

        const currentProductCategory = fetchResult[0];

        // Merge the updates with the current data (but exclude exhibit_id)
        const updatedProductCategory = { ...currentProductCategory, ...updates };
        const { name, image_path } = updatedProductCategory;

        // Update the Product Category
        const updateQuery = 'UPDATE Product_Category SET name = ?, image_path = ? WHERE product_category_id = ?';
        db.query(updateQuery, [name, image_path, productCategoryId], (updateErr, updateResult) => {
            if (updateErr) {
                if (updateErr.code === 'ER_NO_REFERENCED_ROW_1') {
                    return res.status(400).json({ error: "Product Category ID." });
                }
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Product Category not found' });
            }

            // Return the updated Product Category details
            res.json({ product_category_id: productCategoryId, name, image_path });
        });
    });
});

// Soft DELETE a Product Cateogry (set is_deleted to FALSE)
router.delete('/:id', (req, res) => {
    db.query('UPDATE Product_Category SET is_deleted = TRUE WHERE product_category_id = ? AND is_deleted = FALSE', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product Category not found was already deleted' });
            return;
        }
        res.json({ message: 'Product Category successfully deactivated' });
    });
});

// Optional: Reactivate a Product Category
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Product_Category SET is_deleted = FALSE WHERE product_category_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product Category not found' });
            return;
        }
        res.json({ message: 'Product Category successfully reactivated' });
    });
});

module.exports = router;