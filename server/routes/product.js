const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', (req, res) => {
    db.query('SELECT * FROM Product', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET product by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Product WHERE product_id = ?', [req.params.id], (err, results) => {
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
    // Fetch employee data
    const fetchQuery = 'SELECT * FROM Product WHERE product_id = ?';
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
        const { name, description, price, image_path } = updatedEmployee;
        const updateQuery = 'UPDATE Product SET name = ?, description = ?, price = ?, image_path = ?';
        db.query(updateQuery, [name, description, price, image_path], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ id: productId, ...updatedProduct });
        });
    });
});

// Soft DELETE an employee (set is_active to FALSE)
router.delete('/:id', (req, res) => {
    db.query('UPDATE Employee SET is_active = FALSE WHERE employee_id = ? AND is_active = TRUE', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Employee not found or already inactive' });
            return;
        }
        res.json({ message: 'Employee successfully deactivated' });
    });
});

// Optional: Reactivate an employee
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Employee SET is_active = TRUE WHERE employee_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        res.json({ message: 'Employee successfully reactivated' });
    });
});

module.exports = router;