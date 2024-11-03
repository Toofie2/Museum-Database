const express = require("express");
const router = express.Router();
const db = require("../db");

/*
// GET all active Artists ACTIVE
router.get('/', (req, res) => {
    db.query('SELECT * FROM Artist WHERE is_active = TRUE', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
*/

// GET all Artist
router.get("/", (req, res) => {
  db.query("SELECT * FROM Artist", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

/*
// GET Artist by ID ACTIVE
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Artist WHERE artist_id = ? AND is_active = TRUE', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Artist not found or inactive' });
        }
        res.json(results[0]);
    });
});
*/

// GET Artist by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Artist WHERE artist_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Artist not found" });
      }
      res.json(results[0]);
    }
  );
});

// POST a new Artist
router.post("/", (req, res) => {
  const { first_name, middle_initial, last_name } = req.body;

  const insertQuery = `
        INSERT INTO Artist (first_name, middle_initial, last_name)
        VALUES (?, ?, ?, ?)
    `;

  db.query(
    insertQuery,
    [first_name, middle_initial, last_name],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Artist ID already exists" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ artist_id: result.insertId, ...req.body });
    }
  );
});

// PUT (update) Artist by ID
router.put("/:id", (req, res) => {
  const artistId = req.params.id;
  const updates = req.body;

  db.query(
    "SELECT * FROM Artist WHERE artist_id = ?",
    [artistId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Artist not found" });
      }

      const currentArtist = results[0];
      const updatedArtist = { ...currentArtist, ...updates };
      const { first_name, middle_initial, last_name } = updatedArtist;

      const updateQuery = `
            UPDATE Artist 
            SET first_name = ?, middle_initial = ?, last_name = ?
            WHERE artist_id = ?
        `;
      db.query(
        updateQuery,
        [first_name, middle_initial, last_name, artistId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ artist_id: artistId, ...updatedArtist });
        }
      );
    }
  );
});

// DELETE (soft delete) Artist by ID
router.delete("/:id", (req, res) => {
  const artistId = req.params.id;

  // Set is_active to FALSE instead of deleting
  db.query(
    "UPDATE Artist SET is_active = FALSE WHERE artist_id = ? AND is_active = TRUE",
    [artistId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Artist not found or already inactive" });
      }
      res.json({ message: "Artist successfully deactivated" });
    }
  );
});

module.exports = router;
