const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customer products
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer_Product WHERE is_deleted = FALSE', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET customer product by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Customer_Product WHERE customer_product_id = ? AND is_deleted = FALSE', [req.params.id], (err, results) => {
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

// GET customer product by customer_id
router.get('/:id/history', (req, res) => {
    db.query('SELECT * FROM Customer_Product WHERE customer_id = ? AND is_deleted = FALSE ORDER BY date_purchased DESC', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Customer Product not found' });
            return;
        }
        res.json(results);
    });
});

// POST new customer_product(s)
router.post('/', (req, res) => {
    let reqBodyArr = {...req.body};
    const insertQuery = "INSERT INTO Customer_Product (customer_id, product_id, amount_spent, quantity) VALUES (?, ?, ?, ?)";

    for(let i in reqBodyArr){
        const { customer_id, product_id, amount_spent, quantity} = {...reqBodyArr[i]};
        db.query(insertQuery, [customer_id, product_id, amount_spent, quantity], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
        });
    }
    res.status(201).json({...req.body});
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
        const updateQuery = 'UPDATE Customer_Product SET customer_id = ?, product_id = ?, amount_spent = ?, quantity = ? WHERE customer_product_id = ?';
        db.query(updateQuery, [customer_id, product_id, amount_spent, quantity, customerProductId], (updateErr, updateResult) => {
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

// Soft DELETE a customer product (change is_deleted to TRUE)
router.delete('/:id', (req, res) => {
    db.query(`UPDATE Customer_Product SET is_deleted = TRUE WHERE customer_product_id = ? AND is_deleted = FALSE`, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer Product not found or already deleted' });
            return;
        }
        res.json({ message: 'Customer Product successfully deleted' });
    });
});

// Optional: Reactivate a customer product
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Customer_Product SET is_deleted = FALSE WHERE customer_product_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer Product not found' });
            return;
        }
        res.json({ message: 'Customer Product successfully reactivated' });
    });
});

module.exports = router;