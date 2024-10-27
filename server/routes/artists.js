/*app.get('/Artist', (req, res) => {
    db.query('SELECT * FROM Artist', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
  
app.post('/Artist', (req, res) => {
  const { name, bio } = req.body;
  db.query('INSERT INTO Artist (name, bio) VALUES (?, ?)', [name, bio], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, name, bio });
  });
});
*/
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all Artist
router.get('/', (req, res) => {
    db.query('SELECT * FROM Artist', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// GET Artist by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Artist WHERE artist_id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.json(results[0]);
    });
});

// POST a new Artist
router.post('/', (req, res) => {
    const { first_name, middle_initial, last_name, image_path } = req.body;

    const insertQuery = `
        INSERT INTO Artist (first_name, middle_initial, last_name, image_path)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [first_name, middle_initial, last_name, image_path], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ artist_id: result.insertId, ...req.body });
    });
});

// PUT (update) Artist by ID
router.put('/:id', (req, res) => {
    const artistId = req.params.id;
    const updates = req.body;

    db.query('SELECT * FROM Artist WHERE artist_id = ?', [artistId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const currentArtist = results[0];
        const updatedArtist = { ...currentArtist, ...updates };
        const { first_name, middle_initial, last_name, image_path } = updatedArtist;

        const updateQuery = `
            UPDATE Artist 
            SET first_name = ?, middle_initial = ?, last_name = ?, image_path = ?
            WHERE artist_id = ?
        `;
        db.query(updateQuery, [first_name, middle_initial, last_name, image_path, artistId], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ artist_id: artistId, ...updatedArtist });
        });
    });
});

// DELETE (soft delete) Artist by ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM Artist WHERE artist_id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.json({ message: 'Artist successfully deleted' });
    });
});

module.exports = router;
