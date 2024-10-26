const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customer products
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer_Product', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET customer product by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Customer_Product WHERE customer_product_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Customer Product not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new customer product
router.post('/', (req, res) => {
    const { customer_id, product_id, amount_spent, quantity } = req.body;
    const insertQuery = "INSERT INTO Customer_Product (customer_id, product_id, amount_spent, quantity) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [customer_id, product_id, amount_spent, quantity], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// PUT (update) a customer product
router.put('/:id', (req, res) => {
    const customerProductId = req.params.id;
    const updates = req.body;
    // Fetch ticket data
    const fetchQuery = 'SELECT * FROM Customer_Product WHERE customer_product_id = ?';
    db.query(fetchQuery, [customerProductId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Customer Product not found' });
        }
        const currentCustomerProduct = fetchResult[0];
        // Merge the updates with the current data
        const updatedCustomerProduct = { ...currentCustomerProduct, ...updates };
        const { customer_id, product_id, amount_spent, quantity } = updatedCustomerProduct;
        const updateQuery = 'UPDATE Customer_Product SET customer_id = ?, product_id = ?, amount_spent = ?, quantity = ?';
        db.query(updateQuery, [customer_id, product_id, amount_spent, quantity], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer Produt not found' });
            }
            res.json({ id: customerProductId, ...updatedCustomerProduct});
        });
    });
});


module.exports = router;