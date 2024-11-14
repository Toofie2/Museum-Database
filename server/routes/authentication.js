const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users authentication credentials (idk why I added this lol)
router.get('/', (req, res) => {
    db.query('SELECT * FROM Authentication', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        };
        res.json(results);
    });
});

// GET authentication by email
router.get('/email', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: "Email query parameter is required" });
    }

    db.query('SELECT password, customer_id, employee_id, is_active FROM Authentication WHERE email = ?', [email], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'No User found with that email' });
            return;
        }
        res.json(results[0]);
    });
});

// GET authentication by customer ID
router.get('/customer:id', (req, res) => {
    db.query('SELECT * FROM Authentication WHERE customer_id = ?', [req.params.id], (err, results) => {
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

// GET authentication by employee ID
router.get('/employee/:id', (req, res) => {
    db.query('SELECT * FROM Authentication WHERE employee_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new authentication entry
router.post('/', (req, res) => {
    const { customer_id, employee_id, email, password } = req.body;
    const insertQuery = 'INSERT INTO Authentication (customer_id, employee_id, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [customer_id, employee_id, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

// PUT (update) an authentication entry
router.put('/:id', (req, res) => {
    const userEmail = req.params.id;
    const updates = req.body;
    // Fetch authentication data
    const fetchQuery = 'SELECT * FROM Authentication WHERE email = ?';
    db.query(fetchQuery, [userEmail], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const currentUser = fetchResult[0];
        // Merge the updates with the current data
        const updatedUser = { ...currentUser, ...updates };
        const { customer_id, employee_id, email, password } = updatedUser;
        const updateQuery = 'UPDATE Authentication SET customer_id = ?, employee_id = ?, email = ?, password = ? WHERE email = ?';
        db.query(updateQuery, [customer_id, employee_id, email, password, userEmail], (updateErr, updateResult) => {
            if (updateErr) {
                if (updateErr.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ error: "Invalid customer ID." });
                }
                if (updateErr.code === 'ER_NO_REFERENCED_ROW_3') {
                    return res.status(400).json({ error: "Invalid employee ID." });
                }
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ id: userEmail, ...updatedUser });
        });
    });
});


// Soft DELETE user credentials (set is_active to FALSE)
router.delete('/:id', (req, res) => {
    db.query('UPDATE Authentication SET is_active = FALSE WHERE email = ? AND is_active = TRUE', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User credentials not found or already inactive' });
            return;
        }
        res.json({ message: 'User credentials successfully deactivated' });
    });
});

// Optional: Reactivate user credentials
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Authentication SET is_active = TRUE WHERE email = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User credentials not found' });
            return;
        }
        res.json({ message: 'User credentials successfully reactivated' });
    });
});

module.exports = router;