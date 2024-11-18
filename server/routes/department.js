const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all departments
router.get('/', (req, res) => {
    db.query('SELECT * FROM Department', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET department by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Department WHERE department_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new department
router.post('/', (req, res) => {
    const { department_id, name } = req.body;
    const insertQuery = 'INSERT INTO Department (department_id, name) VALUES (?, ?, ?)';
    db.query(insertQuery, [department_id, name], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    });

// PUT (update) an department
router.put('/:id', (req, res) => {
    const departmentId = req.params.id;
    const updates = req.body;
    // Fetch department data
    const fetchQuery = 'SELECT * FROM Department WHERE department_id = ?';
    db.query(fetchQuery, [departmentId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        const currentDepartment = fetchResult[0];
        // Merge the updates with the current data
        const updatedDepartment = { ...currentDepartment, ...updates };
        const { department_id, name } = updatedDepartment;
        const updateQuery = 'UPDATE Department SET department_id = ?, name = ? WHERE department_id = ?';
        db.query(updateQuery, [department_id, name], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Department not found' });
            }
            res.json({ id: departmentId, ...updatedDepartment });
        });
    });
});

// Soft DELETE an department (set is_active to FALSE)
router.delete('/:id', (req, res) => {
    db.query('UPDATE Department SET is_active = FALSE WHERE department_id = ? AND is_active = TRUE', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Department not found or already inactive' });
            return;
        }
        res.json({ message: 'Department successfully deactivated' });
    });
});

// Optional: Reactivate an department
router.patch('/:id/reactivate', (req, res) => {
    db.query('UPDATE Department SET is_active = TRUE WHERE department_id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        res.json({ message: 'Department successfully reactivated' });
    });
});

module.exports = router;