const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all exhibitions with room name that are active
router.get("/", (req, res) => {
  const query = `
    SELECT Exhibition.*, Room.room_name 
    FROM Exhibition 
    JOIN Room ON Exhibition.room_id = Room.room_id
    WHERE Exhibition.is_active = TRUE
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET Exhibition by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Exhibition WHERE exhibit_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length == 0) {
        res.status(404).json({ message: "Exhibition not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// POST a new exhibition
router.post("/", (req, res) => {
  const {
    exhibit_id,
    room_id,
    name,
    description,
    image_path,
    start_date,
    end_date,
    is_active,
    admission_price
  } = req.body;
  const insertQuery =
    "INSERT INTO Exhibition (exhibit_id, room_id, name, description, image_path, start_date, end_date, is_active, admission_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    insertQuery,
    [
      exhibit_id,
      room_id,
      name,
      description,
      image_path,
      start_date,
      end_date,
      is_active,
      admission_price
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// Update exhibit by ID
router.put("/:id", (req, res) => {
  const exhibitId = req.params.id; // The exhibit ID from the URL params
  const updates = req.body; // The updates from the request body

  // Fetch the current exhibit data
  const fetchQuery = "SELECT * FROM Exhibition WHERE exhibit_id = ?";
  db.query(fetchQuery, [exhibitId], (fetchErr, fetchResult) => {
    if (fetchErr) {
      return res.status(500).json({ error: fetchErr.message });
    }
    if (fetchResult.length === 0) {
      return res.status(404).json({ message: "Exhibition not found" });
    }

    const currentExhibition = fetchResult[0];

    // Merge the updates with the current data (but exclude exhibit_id)
    const updatedExhibition = { ...currentExhibition, ...updates };
    const {
      room_id,
      name,
      description,
      image_path,
      start_date,
      end_date,
      is_active,
      admission_price
    } = updatedExhibition;

    // Update the exhibition
    const updateQuery = `
            UPDATE Exhibition 
            SET room_id = ?, name = ?, description = ?, image_path = ?, start_date = ?, end_date = ?, is_active = ?, admission_price = ? 
            WHERE exhibit_id = ?
        `;
    db.query(
      updateQuery,
      [
        room_id,
        name,
        description,
        image_path,
        start_date,
        end_date,
        is_active,
        admission_price,
        exhibitId,
      ],
      (updateErr, updateResult) => {
        if (updateErr) {
          if (updateErr.code === "ER_NO_REFERENCED_ROW_1") {
            return res.status(400).json({ error: "Invalid exhibition ID." });
          }
          return res.status(500).json({ error: updateErr.message });
        }
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ message: "Exhibition not found" });
        }

        // Return the updated exhibition details
        res.json({
          exhibit_id: exhibitId,
          room_id,
          name,
          description,
          image_path,
          start_date,
          end_date,
          is_active,
          admission_price
        });
      }
    );
  });
});

// Soft DELETE an exhibition (set is_active to FALSE)
router.delete("/:id", (req, res) => {
  db.query(
    "UPDATE Exhibition SET is_active = FALSE WHERE exhibit_id = ? AND is_active = TRUE",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res
          .status(404)
          .json({ message: "Exhibition not found or already inactive" });
        return;
      }
      res.json({ message: "Exhibition successfully deactivated" });
    }
  );
});

// Optional: Reactivate an exhibition
router.patch("/:id/reactivate", (req, res) => {
  db.query(
    "UPDATE Exhibition SET is_active = TRUE WHERE exhibit_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Exhibition not found" });
        return;
      }
      res.json({ message: "Exhibition successfully reactivated" });
    }
  );
});

module.exports = router;
