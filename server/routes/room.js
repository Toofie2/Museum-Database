const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all rooms
router.get('/', (req, res) => {
    db.query('SELECT * FROM Room', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// GET Room by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM Room WHERE room_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length == 0) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        res.json(results[0]);
    });
});

// POST a new room
router.post('/', (req, res) => {
    const { room_id, room_name, floor_number } = req.body;
        const insertQuery = 'INSERT INTO Room ( room_id, room_name, floor_number ) VALUES (?, ?, ?)';
        db.query(insertQuery, [ room_id, room_name, floor_number ], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    });

// Update room by ID
router.put('/:id', (req, res) => {
    const roomId = req.params.id; // The room ID from the URL params
    const updates = req.body; // The updates from the request body

    // Fetch the current room data
    const fetchQuery = 'SELECT * FROM Room WHERE room_id = ?';
    db.query(fetchQuery, [roomId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const currentRoom = fetchResult[0];

        // Merge the updates with the current data (but exclude room_id)
        const updatedRoom = { ...currentRoom, ...updates };
        const { room_name, floor_number } = updatedRoom;

        // Only update room_name and floor_number (not room_id)
        const updateQuery = 'UPDATE Room SET room_name = ?, floor_number = ? WHERE room_id = ?';
        db.query(updateQuery, [room_name, floor_number, roomId], (updateErr, updateResult) => {
            if (updateErr) {
                if (updateErr.code === 'ER_NO_REFERENCED_ROW_1') {
                    return res.status(400).json({ error: "Invalid room ID." });
                }
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Return the updated room details (with room_id included in the response)
            res.json({ room_id: roomId, room_name, floor_number });
        });
    });
});

module.exports = router;
