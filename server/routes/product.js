const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', (req, res) => {
    db.query('SELECT * FROM Product WHERE is_deleted = FALSE', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET product by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Product WHERE product_id = ? AND is_deleted = FALSE', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new product
router.post('/', (req, res) => {
    const { name, description, price, image_path, } = req.body;
    const insertQuery = 'INSERT INTO Product (name, description, price, image_path) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [name, description, price, image_path], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// PUT (update) a product
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const updates = req.body;
    // Fetch product data
    const fetchQuery = 'SELECT * FROM Product WHERE product_id = ? AND is_deleted = FALSE';
    db.query(fetchQuery, [productId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const currentProduct = fetchResult[0];
        // Merge the updates with the current data
        const updatedProduct = { ...currentProduct, ...updates };
        const { name, description, price, image_path } = updatedProduct;
        const updateQuery = 'UPDATE Product SET name = ?, description = ?, price = ?, image_path = ? WHERE product_id = ?';
        db.query(updateQuery, [name, description, price, image_path, productId], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ id: productId, ...updatedProduct});
        });
    });
});

// Soft DELETE a product (change is_deleted to TRUE)
router.delete('/:id', (req, res) => {
    db.query('UPDATE Product SET is_deleted = TRUE WHERE product_id = ? AND is_deleted= FALSE', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found or already deleted' });
            return;
        }
        res.json({ message: 'Product successfully deleted' });
    });
});

// Optional: Reactivate a product
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Product SET is_deleted = FALSE WHERE product_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({ message: 'Product successfully reactivated' });
    });
});

module.exports = router;