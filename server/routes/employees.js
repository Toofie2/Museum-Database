const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all employees
router.get('/', (req, res) => {
    db.query('SELECT * FROM Employee', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET employee by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Employee WHERE employee_id = ?', [req.params.id], (err, results) => {
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

// POST a new employee, check if SSN exists first to avoid mySQL auto incrementing even if error occurs
router.post('/', (req, res) => {
    const { department_id, first_name, middle_initial, last_name, date_of_birth, sex, address, role, work_email, password, hire_date, start_date, salary, ssn } = req.body;
    const checkSSNQuery = 'SELECT employee_id FROM Employee WHERE ssn = ?';
    db.query(checkSSNQuery, [ssn], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "An employee with this SSN already exists." });
        }
        const insertQuery = 'INSERT INTO Employee (department_id, first_name, middle_initial, last_name, date_of_birth, sex, address, role, work_email, password, hire_date, start_date, salary, ssn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [department_id, first_name, middle_initial, last_name, date_of_birth, sex, address, role, work_email, password, hire_date, start_date, salary, ssn], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    });
});

// PUT (update) an employee
router.put('/:id', (req, res) => {
    const employeeId = req.params.id;
    const updates = req.body;
    // Fetch employee data
    const fetchQuery = 'SELECT * FROM Employee WHERE employee_id = ?';
    db.query(fetchQuery, [employeeId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const currentEmployee = fetchResult[0];
        // Merge the updates with the current data
        const updatedEmployee = { ...currentEmployee, ...updates };
        const { department_id, first_name, middle_initial, last_name, date_of_birth, sex, address, role, work_email, password, hire_date, start_date, salary, ssn } = updatedEmployee;
        const updateQuery = 'UPDATE Employee SET department_id = ?, first_name = ?, middle_initial = ?, last_name = ?, date_of_birth = ?, sex = ?, address = ?, role = ?, work_email = ?, password = ?, hire_date = ?, start_date = ?, salary = ?, ssn = ? WHERE employee_id = ?';
        db.query(updateQuery, [department_id, first_name, middle_initial, last_name, date_of_birth, sex, address, role, work_email, password, hire_date, start_date, salary, ssn, employeeId], (updateErr, updateResult) => {
            if (updateErr) {
                if (updateErr.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({ error: "Invalid department ID." });
                }
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json({ id: employeeId, ...updatedEmployee });
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