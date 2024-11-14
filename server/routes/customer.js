const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customers
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET latest customer id
router.get('/last', (req, res) => {
    db.query('SELECT * FROM Customer ORDER BY customer_id DESC LIMIT 1', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        };
        res.json(results[0]);
    });
});

// GET customer by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Customer WHERE customer_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new customer (is_member will require a trigger)
router.post('/', (req, res) => {
    const { first_name, middle_initial, last_name, is_member, membership_start_date } = req.body;
    const insertQuery = 'INSERT INTO Customer (first_name, middle_initial, last_name, is_member, membership_start_date) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [first_name, middle_initial, last_name, is_member, membership_start_date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// PUT (update) a customer
router.put('/:id', (req, res) => {
    const customerId = req.params.id;
    const updates = req.body;
    // Fetch customer data
    const fetchQuery = 'SELECT * FROM Customer WHERE customer_id = ?';
    db.query(fetchQuery, [customerId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        const currentCustomer = fetchResult[0];
        // Merge the updates with the current data
        const updatedCustomer = { ...currentCustomer, ...updates };
        const { first_name, middle_initial, last_name, is_member, membership_start_date, } = updatedCustomer;
        const updateQuery = 'UPDATE Customer SET first_name = ?, middle_initial = ?, last_name = ?, is_member = ?, membership_start_date = ? WHERE customer_id = ?';
        db.query(updateQuery, [first_name, middle_initial, last_name, is_member, membership_start_date, customerId], (updateErr, updateResult) => {
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json({ id: customerId, ...updatedCustomer });
        });
    });
});

// Soft DELETE a customer (set is_active to FALSE)
router.delete('/:id', (req, res) => {
    db.query('UPDATE Customer SET is_active = FALSE WHERE customer_id = ? AND is_active = TRUE', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer not found or already inactive' });
            return;
        }
        res.json({ message: 'Customer successfully deactivated' });
    });
});

// Optional: Reactivate a customer
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Customer SET is_active = TRUE WHERE customer_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer not found' });
            return;
        }
        res.json({ message: 'Customer successfully reactivated' });
    });
});

module.exports = router;
