/* app.get('/collections', (req, res) => {
  db.query('SELECT * FROM collections', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
app.post('/collections', (req, res) => {
    const { name, description } = req.body;
    db.query('INSERT INTO collections (name, description) VALUES (?, ?)', [name, description], (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: results.insertId, name, description });
    });
  });
  */

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all collections
router.get('/', (req, res) => {
    db.query('SELECT * FROM Collection', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

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
        INSERT INTO collections (title, description)
        VALUES (?, ?)
    `;

    db.query(insertQuery, [title, description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ collection_id: result.insertId, title, description });
    });
});

// PUT (update) collection by ID
router.put('/:id', (req, res) => {
    const collectionId = req.params.id;
    const updates = req.body;

    db.query('SELECT * FROM collections WHERE collection_id = ?', [collectionId], (err, results) => {
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
            UPDATE collections 
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

// DELETE (soft delete) collection by ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM collections WHERE collection_id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.json({ message: 'Collection successfully deleted' });
    });
});

module.exports = router;
