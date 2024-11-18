const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all customer tickets
// GET all customer tickets
router.get('/', (req, res) => {
    db.query('SELECT * FROM Customer_Exhibition WHERE is_deleted = FALSE', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET customer ticket by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Customer_Exhibition WHERE customer_exhibition_id = ? AND is_deleted = FALSE', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Customer Exhibition not found' });
            return;
        }
        res.json(results[0]);
    });
});

// GET customer exhibition by customer_id
router.get('/:id/history', (req, res) => {
    const query = `
    SELECT Customer_Exhibition.*, Exhibition.name
    FROM Customer_Exhibition
    JOIN Exhibition ON Customer_Exhibition.exhibition_id = Exhibition.exhibit_id
    WHERE Customer_Exhibition.is_deleted = FALSE AND Customer_Exhibition.customer_id = ?
    ORDER BY date_purchased DESC
  `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Customer Exhibition not found' });
            return;
        }
        res.json(results);
    });
});

// POST new customer_ticket(s)
router.post('/', (req, res) => {
    let reqBodyArr = {...req.body};
    const insertQuery = "INSERT INTO Customer_Exhibition (customer_id, exhibition_id, amount_spent, valid_day) VALUES (?, ?, ?, ?)";

    for(let i in reqBodyArr){
        const { customer_id, exhibition_id, amount_spent, valid_day} = {...reqBodyArr[i]};
        db.query(insertQuery, [customer_id, exhibition_id, amount_spent, valid_day], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
        });
    }
    res.status(201).json({...req.body});
});


// PUT (update) a customer ticket
router.put('/:id', (req, res) => {
    const customerExhibitionId = req.params.id;
    const updates = req.body;
    // Fetch customer ticket data
    const fetchQuery = 'SELECT * FROM Customer_Exhibtition WHERE customer_exhibition_id = ?';
    db.query(fetchQuery, [customerExhibitionId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Customer Exhibition not found' });
        }
        const currentCustomerExhibition = fetchResult[0];
        // Merge the updates with the current data
        const updatedCustomerExhibition = { ...currentCustomerExhibition, ...updates };
        const { customer_id, exhibition_id, amount_spent, valid_day} = updatedCustomerExhibition;
        const updateQuery = 'UPDATE Customer_Exhibition SET customer_id = ?, exhibition_id = ?, amount_spent = ?, valid_day = ? WHERE customer_exhibition_id = ?';
        db.query(updateQuery, [customer_id, exhibition_id, amount_spent, valid_day, customerExhibitionId], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer Exhibition not found' });
            }
            res.json({ id: customerExhibitionId, ...updatedCustomerExhibition});
        });
    });
});

// Soft DELETE a customer ticket (change is_deleted to TRUE)
router.delete('/:id', (req, res) => {
    db.query(`UPDATE Customer_Exhibition SET is_deleted = TRUE WHERE customer_exhibition_id = ? AND is_deleted = FALSE`, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer Exhibition not found or already deleted' });
            return;
        }
        res.json({ message: 'Customer Exhibition successfully deleted' });
    });
});

// Optional: Reactivate a customer ticket
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Customer_Exhibition SET is_deleted = FALSE WHERE customer_exhibition_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer Exhibition not found' });
            return;
        }
        res.json({ message: 'Customer Exhibition successfully reactivated' });
    })
    const customerExhibitionId = req.params.id;
    const updates = req.body;
    // Fetch customer ticket data
    const fetchQuery = 'SELECT * FROM Customer_Exhibtition WHERE customer_exhibition_id = ?';
    db.query(fetchQuery, [customerExhibitionId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Customer Exhibition not found' });
        }
        const currentCustomerExhibition = fetchResult[0];
        // Merge the updates with the current data
        const updatedCustomerExhibition = { ...currentCustomerExhibition, ...updates };
        const { customer_id, exhibition_id, amount_spent, valid_day} = updatedCustomerExhibition;
        const updateQuery = 'UPDATE Customer_Exhibition SET customer_id = ?, exhibition_id = ?, amount_spent = ?, valid_day = ? WHERE customer_exhibition_id = ?';
        db.query(updateQuery, [customer_id, exhibition_id, amount_spent, valid_day, customerExhibitionId], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Customer Exhibition not found' });
            }
            res.json({ id: customerExhibitionId, ...updatedCustomerExhibition});
        });
    });
});

// Soft DELETE a customer ticket (change is_deleted to TRUE)
router.delete('/:id', (req, res) => {
    db.query(`UPDATE Customer_Exhibition SET is_deleted = TRUE WHERE customer_exhibition_id = ? AND is_deleted = FALSE`, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer Exhibition not found or already deleted' });
            return;
        }
        res.json({ message: 'Customer Exhibition successfully deleted' });
    });
});

// Optional: Reactivate a customer ticket
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Customer_Exhibition SET is_deleted = FALSE WHERE customer_exhibition_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Customer Exhibition not found' });
            return;
        }
        res.json({ message: 'Customer Exhibition successfully reactivated' });
    });
});

module.exports = router;