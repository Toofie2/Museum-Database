const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customer exhibitions
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer_Exhibition', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// POST a new entry to customer exhibition
router.post('/', (req, res) => {
    const { customer_ticket_id, exhibition_id, date_visited } = req.body; // Ensure all required fields are included

    const insertQuery = 'INSERT INTO Customer_Exhibition (customer_ticket_id, exhibition_id, date_visited) VALUES (?, ?, ?)';
    db.query(insertQuery, [customer_ticket_id, exhibition_id, date_visited], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, customer_ticket_id, exhibition_id, date_visited });
    });
});

router.put('/:id', (req, res) => {
    const customerexId = req.params.id; // The customer exhibition ID from the URL params
    const { date_visited } = req.body; // Extracting date_visited from the request body

    // Check if date_visited is provided
    if (!date_visited) {
        return res.status(400).json({ error: 'date_visited is required.' });
    }

    // Update only the date_visited for the given customer exhibition ID
    const updateQuery = 'UPDATE Customer_Exhibition SET date_visited = ? WHERE customer_exhibition_id = ?';
    db.query(updateQuery, [date_visited, customerexId], (updateErr, updateResult) => {
        if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
        }
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer Exhibition not found' });
        }

        // Return the updated customer exhibition details
        res.json({ customer_exhibition_id: customerexId, date_visited });
    });
});

module.exports = router;