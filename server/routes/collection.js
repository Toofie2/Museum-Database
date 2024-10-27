const express = require('express');
const router = express.Router();
const db = require('../db');

/* 
// GET all active collections
router.get('/', (req, res) => {
    db.query('SELECT * FROM Collection WHERE is_active = TRUE', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

*/

// GET all collections
router.get('/', (req, res) => {
    db.query('SELECT * FROM Collection', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
/*
// GET Collection by ID ACTIVE
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Collection WHERE collection_id = ? AND is_active = TRUE', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Collection not found or inactive' });
        }
        res.json(results[0]);
    });
});
*/
// GET collection by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Collection WHERE collection_id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.json(results[0]);
    });
});

// POST a new collection
router.post('/', (req, res) => {
    const { title, description } = req.body;

    const insertQuery = `
        INSERT INTO Collection (title, description)
        VALUES (?, ?)
    `;

    db.query(insertQuery, [title, description], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Collection ID already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ collection_id: result.insertId, title, description });
    });
});


// PUT (update) collection by ID
router.put('/:id', (req, res) => {
    const collectionId = req.params.id;
    const updates = req.body;

    db.query('SELECT * FROM Collection WHERE collection_id = ?', [collectionId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        const currentCollection = results[0];
        const updatedCollection = { ...currentCollection, ...updates };
        const { title, description } = updatedCollection;

        const updateQuery = `
            UPDATE Collection 
            SET title = ?, description = ?
            WHERE collection_id = ?
        `;
        db.query(updateQuery, [title, description, collectionId], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ collection_id: collectionId, title, description });
        });
    });
});

// DELETE (soft delete) Collection by ID
router.delete('/:id', (req, res) => {
    const collectionId = req.params.id;
    
    // Set is_active to FALSE instead of deleting
    db.query('UPDATE Collection SET is_active = FALSE WHERE collection_id = ? AND is_active = TRUE', [collectionId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Collection not found or already inactive' });
        }
        res.json({ message: 'Collection successfully deactivated' });
    });
});


module.exports = router;
