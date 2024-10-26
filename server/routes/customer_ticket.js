const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customer tickets
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer_Ticket', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET customer ticket by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Customer_Ticket WHERE customer_ticket_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Customer Ticket not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new customer_ticket
router.post('/', (req, res) => {
    const { customer_id, ticket_id, amount_spent, valid_start, valid_end } = req.body;
    const insertQuery = "INSERT INTO Customer_Ticket (customer_id, ticket_id, amount_spent, valid_start, valid_end) VALUES (?, ?, ?, ?, ?)";
    db.query(insertQuery, [customer_id, ticket_id, amount_spent, valid_start, valid_end], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// PUT (update) a customer ticket
router.put('/:id', (req, res) => {
    const customerTicketId = req.params.id;
    const updates = req.body;
    // Fetch customer ticket data
    const fetchQuery = 'SELECT * FROM Customer_Ticket WHERE customer_ticket_id = ?';
    db.query(fetchQuery, [customerTicketId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Customer Ticket not found' });
        }
        const currentCustomerTicket = fetchResult[0];
        // Merge the updates with the current data
        const updatedCustomerTicket = { ...currentCustomerTicket, ...updates };
        const { customer_id, ticket_id, amount_spent, valid_start, valid_end } = updatedCustomerTicket;
        const updateQuery = 'UPDATE Customer_Ticket SET customer_id = ?, ticket_id = ?, amount_spent = ?, valid_start = ?, valid_end = ?';
        db.query(updateQuery, [customer_id, ticket_id, amount_spent, valid_start, valid_end], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer Ticket not found' });
            }
            res.json({ id: customerTicketId, ...updatedCustomerTicket});
        });
    });
});


module.exports = router;