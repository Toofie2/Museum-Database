const express = require("express");
const router = express.Router();
const db = require("../db");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Email transport setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Password reset token expiry time (1 hour)
const RESET_PASSWORD_EXPIRY = 3600000;

// GET all users authentication credentials (idk why I added this lol)
router.get("/", (req, res) => {
  db.query("SELECT * FROM Authentication", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET authentication by email
router.get("/email", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }

  db.query(
    "SELECT password, customer_id, employee_id, is_active FROM Authentication WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length == 0) {
        res.status(404).json({ message: "No User found with that email" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// GET authentication by customer ID
router.get("/customer:id", (req, res) => {
  db.query(
    "SELECT * FROM Authentication WHERE customer_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length == 0) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// GET authentication by employee ID
router.get("/employee/:id", (req, res) => {
  db.query(
    "SELECT * FROM Authentication WHERE employee_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length == 0) {
        res.status(404).json({ message: "Employee not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// POST a new authentication entry
router.post("/", (req, res) => {
  const { customer_id, employee_id, email, password } = req.body;
  const insertQuery =
    "INSERT INTO Authentication (customer_id, employee_id, email, password) VALUES (?, ?, ?, ?)";
  db.query(
    insertQuery,
    [customer_id, employee_id, email, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// PUT (update) an authentication entry
router.put("/:id", (req, res) => {
  const userEmail = req.params.id;
  const updates = req.body;
  // Fetch authentication data
  const fetchQuery = "SELECT * FROM Authentication WHERE email = ?";
  db.query(fetchQuery, [userEmail], (fetchErr, fetchResult) => {
    if (fetchErr) {
      return res.status(500).json({ error: fetchErr.message });
    }
    if (fetchResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUser = fetchResult[0];
    // Merge the updates with the current data
    const updatedUser = { ...currentUser, ...updates };
    const { customer_id, employee_id, email, password } = updatedUser;
    const updateQuery =
      "UPDATE Authentication SET customer_id = ?, employee_id = ?, email = ?, password = ? WHERE email = ?";
    db.query(
      updateQuery,
      [customer_id, employee_id, email, password, userEmail],
      (updateErr, updateResult) => {
        if (updateErr) {
          if (updateErr.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({ error: "Invalid customer ID." });
          }
          if (updateErr.code === "ER_NO_REFERENCED_ROW_3") {
            return res.status(400).json({ error: "Invalid employee ID." });
          }
          return res.status(500).json({ error: updateErr.message });
        }
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ id: userEmail, ...updatedUser });
      }
    );
  });
});

// Soft DELETE user credentials (set is_active to FALSE)
router.delete("/:id", (req, res) => {
  db.query(
    "UPDATE Authentication SET is_active = FALSE WHERE email = ? AND is_active = TRUE",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res
          .status(404)
          .json({ message: "User credentials not found or already inactive" });
        return;
      }
      res.json({ message: "User credentials successfully deactivated" });
    }
  );
});

// Optional: Reactivate user credentials
router.patch("/:id/reactivate", (req, res) => {
  db.query(
    "UPDATE Authentication SET is_active = TRUE WHERE email = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "User credentials not found" });
        return;
      }
      res.json({ message: "User credentials successfully reactivated" });
    }
  );
});

// Request password reset email
router.post("/password-reset", (req, res) => {
  const { email } = req.body;
  console.log("Received request for password reset:", email); // Log the email received

  if (!email) {
    console.error("Error: No email provided."); // Log error
    return res.status(400).json({ error: "Email is required." });
  }

  db.query(
    "SELECT * FROM Authentication WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Database error:", err.message); // Log database error
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        console.error("Error: No user found for email:", email); // Log user not found
        return res.status(404).json({ message: "User not found." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + RESET_PASSWORD_EXPIRY)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      console.log("Generated reset token:", resetToken);
      console.log("Generated reset token expiry:", resetTokenExpiry);

      db.query(
        "UPDATE Authentication SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [resetToken, resetTokenExpiry, email],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating reset token:", updateErr.message); // Log update error
            return res.status(500).json({ error: updateErr.message });
          }

          const resetUrl = `${process.env.FRONTEND_URL}?token=${resetToken}`; /*${process.env.FRONTEND_URL}*/ //TODO fix later
          console.log("Generated reset URL:", resetUrl);

          transporter.sendMail(
            {
              to: email,
              subject: "Password Reset Request",
              html: `<p>Click the link below to reset your password:</p>
                     <p><a href="${resetUrl}">${resetUrl}</a></p>
                     <p>If you did not request this, please ignore this email.</p>`,
            },
            (mailErr) => {
              if (mailErr) {
                console.error("Error sending email:", mailErr.message); // Log email error
                return res.status(500).json({ error: "Failed to send email." });
              }
              res.status(200).json({ message: "Password reset email sent." });
            }
          );
        }
      );
    }
  );
});

  
  // POST: Validate reset token and reset password
  router.post("/password-reset/validate", (req, res) => {
    const { token, password } = req.body;
  
    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Reset token and new password are required." });
    }
  
    // Find user with the reset token
    db.query(
      "SELECT * FROM Authentication WHERE reset_token = ? AND reset_token_expiry > ?",
      [token, Date.now()],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        if (results.length === 0) {
          return res
            .status(400)
            .json({ message: "Invalid or expired reset token." });
        }
  
        // Reset password and clear token
        const email = results[0].email;
        db.query(
          "UPDATE Authentication SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
          [password, email],
          (updateErr) => {
            if (updateErr) {
              return res.status(500).json({ error: updateErr.message });
            }
            res.status(200).json({ message: "Password reset successfully." });
          }
        );
      }
    );
  });
  
module.exports = router;
