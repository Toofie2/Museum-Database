const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all tickets
router.get('/', (req, res) => {
    db.query('SELECT * FROM Ticket', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


module.exports = router;