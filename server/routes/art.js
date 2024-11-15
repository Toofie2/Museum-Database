const express = require("express");
const router = express.Router();
const db = require("../db");

/*
// GET all active Artworks
router.get('/', (req, res) => {
    db.query('SELECT * FROM Art WHERE is_active = TRUE', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

*/

// GET Art pieces by Exhibit ID
router.get("/exhibit/:exhibit_id", (req, res) => {
  const { exhibit_id } = req.params;

  db.query(
    "SELECT * FROM Art WHERE exhibit_id = ?",
    [exhibit_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// GET Art pieces by Exhibit ID
router.get("/collection/:collection_id", (req, res) => {
  const { collection_id } = req.params;

  db.query(
    "SELECT * FROM Art WHERE collection_id = ?",
    [collection_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// GET all mediums
router.get("/mediums", (req, res) => {
  const query = `
    SELECT DISTINCT art_medium 
    FROM Art 
    WHERE art_medium IS NOT NULL 
    ORDER BY art_medium
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Extract just the medium names from the results
    const mediums = results.map((result) => result.art_medium);
    res.json(mediums);
  });
});

// GET all Art, including artist name, collection name, and exhibition name
router.get("/", (req, res) => {
  const query = `
    SELECT 
      a.*,
      CONCAT(ar.first_name, 
        CASE 
          WHEN ar.middle_initial IS NOT NULL THEN CONCAT(' ', ar.middle_initial, ' ')
          ELSE ' '
        END,
        ar.last_name) AS artist_name,
      c.title AS collection_name,
      e.name AS exhibition_name
    FROM Art a
    LEFT JOIN Artist ar ON a.artist_id = ar.artist_id
    LEFT JOIN Collection c ON a.collection_id = c.collection_id
    LEFT JOIN Exhibition e ON a.exhibit_id = e.exhibit_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

/*
// GET Artwork by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Art WHERE art_id = ? AND is_active = TRUE', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) 
            return res.status(404).json({ message: 'Artwork not found or inactive' });
        }
        res.json(results[0]);
    });
});
 */

// GET Art by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Art WHERE art_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ message: "Art not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// POST a new Art piece
router.post("/", (req, res) => {
  const {
    art_id,
    artist_id,
    collection_id,
    art_title,
    art_desc,
    art_image_path,
    art_medium,
    date_created,
    date_received,
  } = req.body;

  // Make sure date_created <= date_received
  if (new Date(date_created) > new Date(date_received)) {
    return res.status(400).json({
      message:
        "Invalid dates: date_created should be before or equal to date_received",
    });
  }

  const insertQuery = `
        INSERT INTO Art (art_id, artist_id, collection_id, art_title, art_desc, art_image_path, art_medium, date_created, date_received)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    insertQuery,
    [
      art_id,
      artist_id,
      collection_id,
      art_title,
      art_desc,
      art_image_path,
      art_medium,
      date_created,
      date_received,
    ],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Art ID already exists" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// PUT (update) Art by ID
router.put("/:id", (req, res) => {
  const artId = req.params.id;
  const updates = req.body;

  db.query("SELECT * FROM Art WHERE art_id = ?", [artId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Art not found" });
    }

    const currentArt = results[0];
    const updatedArt = { ...currentArt, ...updates };
    const {
      artist_id,
      collection_id,
      art_title,
      description,
      image_path,
      medium,
      date_created,
      date_received,
    } = updatedArt;

    // Ensure valid dates
    if (new Date(date_created) > new Date(date_received)) {
      return res.status(400).json({
        message:
          "Invalid dates: date_created should be before or equal to date_received",
      });
    }

    const updateQuery = `
            UPDATE Art 
            SET artist_id = ?, collection_id = ?, art_title = ?, description = ?, image_path = ?, medium = ?, date_created = ?, date_received = ?
            WHERE art_id = ?
        `;
    db.query(
      updateQuery,
      [
        artist_id,
        collection_id,
        art_title,
        description,
        image_path,
        medium,
        date_created,
        date_received,
        artIdrtId,
      ],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ art_id: artId, ...updatedArt });
      }
    );
  });
});

// DELETE (soft delete) Art by ID (set is_active = FALSE)
router.delete("/:id", (req, res) => {
  db.query(
    "UPDATE Art SET is_active = FALSE WHERE art_id = ? AND is_active = TRUE",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Art not found or already inactive" });
      }
      res.json({ message: "Art successfully deactivated" });
    }
  );
});

module.exports = router;
