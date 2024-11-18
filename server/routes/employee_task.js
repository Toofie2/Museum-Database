const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all tasks with employee names
router.get("/", (req, res) => {
  const { employee_id } = req.query;

  let query = `
          SELECT 
            et.employee_task_id, 
            et.name, 
            et.description, 
            et.is_completed, 
            et.due_date, -- Added due_date to the SELECT clause
            CONCAT(e.first_name, 
              CASE 
                WHEN e.middle_initial IS NOT NULL AND e.middle_initial != '' 
                  THEN CONCAT(' ', e.middle_initial, ' ')
                ELSE ' '
              END,
              e.last_name) AS employee_name
          FROM Employee_Task et
          LEFT JOIN Employee e ON et.employee_id = e.employee_id
          WHERE et.is_deleted = 0
        `;

  // Add employee filter if employee_id is provided
  const queryParams = [];
  if (employee_id) {
    query += ` AND et.employee_id = ?`;
    queryParams.push(employee_id);
  }

  // Order by completion status and due date
  query += ` ORDER BY et.is_completed ASC, et.due_date ASC`;

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: err.message });
    }

    // Map the results to ensure correct boolean values
    const processedResults = results.map((task) => ({
      ...task,
      is_completed: Boolean(task.is_completed),
    }));

    res.json(processedResults);
  });
});

// GET task by ID
router.get("/:id", (req, res) => {
  const query = `
    SELECT 
      et.*,
      CONCAT(e.first_name, 
        CASE 
          WHEN e.middle_initial IS NOT NULL THEN CONCAT(' ', e.middle_initial, ' ')
          ELSE ' '
        END,
        e.last_name) AS employee_name
    FROM Employee_Task et
    LEFT JOIN Employee e ON et.employee_id = e.employee_id
    WHERE et.employee_task_id = ? AND et.is_deleted = FALSE
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(results[0]);
  });
});

// POST a new task
router.post("/", (req, res) => {
  const {
    employee_task_id,
    name,
    description,
    is_completed,
    employee_id,
    due_date,
  } = req.body;

  // Validate due_date is present
  if (!due_date) {
    return res.status(400).json({ error: "Due date is required" });
  }

  // If employee_id is provided, verify the employee exists
  if (employee_id) {
    db.query(
      "SELECT employee_id FROM Employee WHERE employee_id = ?",
      [employee_id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
          return res.status(400).json({ error: "Invalid employee ID" });
        }
        insertTask();
      }
    );
  } else {
    insertTask();
  }

  function insertTask() {
    const insertQuery = `
        INSERT INTO Employee_Task (
          employee_task_id, 
          name, 
          description, 
          is_completed,
          employee_id,
          due_date
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

    db.query(
      insertQuery,
      [
        employee_task_id,
        name,
        description,
        is_completed || false,
        employee_id || null,
        due_date,
      ],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Task ID already exists" });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          employee_task_id,
          name,
          description,
          is_completed: is_completed || false,
          employee_id: employee_id || null,
          due_date,
          is_deleted: false,
        });
      }
    );
  }
});

// PUT (update) a task
router.put("/:id", (req, res) => {
  const taskId = req.params.id;
  const updates = req.body;

  db.query(
    "SELECT * FROM Employee_Task WHERE employee_task_id = ? AND is_deleted = FALSE",
    [taskId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      const currentTask = results[0];
      const updatedTask = { ...currentTask, ...updates };
      const { name, description, is_completed, employee_id, due_date } =
        updatedTask;

      const updateQuery = `
          UPDATE Employee_Task 
          SET 
            name = ?,
            description = ?,
            is_completed = ?,
            employee_id = ?,
            due_date = ?
          WHERE employee_task_id = ? AND is_deleted = FALSE
        `;

      db.query(
        updateQuery,
        [name, description, is_completed, employee_id, due_date, taskId],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
          }
          res.json({
            employee_task_id: parseInt(taskId),
            name,
            description,
            is_completed,
            employee_id,
            due_date,
            is_deleted: false,
          });
        }
      );
    }
  );
});

// Soft DELETE a task
router.delete("/:id", (req, res) => {
  const query = `
    UPDATE Employee_Task 
    SET is_deleted = TRUE 
    WHERE employee_task_id = ? AND is_deleted = FALSE
  `;

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or already deleted" });
    }
    res.json({ message: "Task successfully deleted" });
  });
});

// Optional: Restore a deleted task
router.patch("/:id/restore", (req, res) => {
  const query = `
    UPDATE Employee_Task 
    SET is_deleted = FALSE 
    WHERE employee_task_id = ?
  `;

  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task successfully restored" });
  });
});

module.exports = router;
