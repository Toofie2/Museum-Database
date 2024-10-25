const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all tickets
router.get('/', (req, res) => {
    db.query('SELECT * FROM Ticket WHERE is_deleted = FALSE', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET ticket by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Ticket WHERE ticket_id = ? AND is_deleted = FALSE', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new ticket
router.post('/', (req, res) => {
    const { type, price } = req.body;
    const insertQuery = "INSERT INTO Ticket (type, price) VALUES (?, ?)";
    db.query(insertQuery, [type, price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// PUT (update) a ticket
router.put('/:id', (req, res) => {
    const ticketId = req.params.id;
    const updates = req.body;
    // Fetch ticket data
    const fetchQuery = 'SELECT * FROM Ticket WHERE ticket_id = ? AND is_deleted = FALSE';
    db.query(fetchQuery, [ticketId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        const currentTicket = fetchResult[0];
        // Merge the updates with the current data
        const updatedTicket = { ...currentTicket, ...updates };
        const { type, price } = updatedTicket;
        const updateQuery = 'UPDATE Ticket SET type = ?, price = ?';
        db.query(updateQuery, [type, price], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            res.json({ id: ticketId, ...updatedTicket});
        });
    });
});

// Soft DELETE a ticket (change is_deleted to TRUE)
router.delete('/:id', (req, res) => {
    db.query(`UPDATE Ticket SET is_deleted = TRUE WHERE ticket_id = ? AND is_deleted = FALSE`, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ticket not found or already deleted' });
            return;
        }
        res.json({ message: 'Ticket successfully deleted' });
    });
});

// Optional: Reactivate a ticket
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Ticket SET is_deleted = FALSE WHERE ticket_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        res.json({ message: 'Ticket successfully reactivated' });
    });
});

module.exports = router;