const BASE_URL = "http://localhost:3000";
const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file to handle your DB connection

// Endpoint for Revenue Report
router.get('/revenue', async (req, res) => {
  try {
    const revenueQuery = `
      SELECT
        SUM(cp.amount_spent) AS product_revenue,
        SUM(ct.amount_spent) AS ticket_revenue,
        (SUM(cp.amount_spent) + SUM(ct.amount_spent)) AS total_revenue
      FROM Customer_Product cp
      LEFT JOIN Customer_Ticket ct ON cp.customer_id = ct.customer_id
      WHERE cp.is_deleted = FALSE AND ct.is_deleted = FALSE;
    `;

    console.log("Running revenue query...");

    db.query(revenueQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: "Could not load revenue report." });
      }

      console.log('Raw Revenue Data:', results);

      // If no results or no data is available
      if (results.length === 0 || !results[0]) {
        return res.status(404).json({ message: "No revenue data available" });
      }

      // Log the specific fields you're sending
      const { product_revenue, ticket_revenue, total_revenue } = results[0];
      console.log('Revenue Calculated:', { product_revenue, ticket_revenue, total_revenue });

      // Send back the calculated revenue data
      res.json({
        product_revenue,
        ticket_revenue,
        total_revenue
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load revenue report." });
  }
});

// Endpoint for Exhibition Report
router.get('/exhibition-report', async (req, res) => {
  try {
    const exhibitionQuery = `SELECT
    e.exhibit_id,
    e.name AS exhibition_name,
    COUNT(ce.customer_ticket_id) AS num_visits,
    SUM(ct.amount_spent) AS total_revenue,
    GROUP_CONCAT(DISTINCT ce.customer_ticket_id) AS customer_ticket_ids
FROM
    Customer_Exhibition ce
JOIN
    Exhibition e ON ce.exhibition_id = e.exhibit_id
JOIN
    Customer_Ticket ct ON ct.customer_ticket_id = ce.customer_ticket_id
WHERE
    ce.date_visited BETWEEN '2012-01-01' AND '2024-11-14'
    AND ct.is_deleted = 0 
GROUP BY
    e.exhibit_id
ORDER BY
    num_visits DESC;

    `;

    console.log("Running exhibition report query...");

    db.query(exhibitionQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: "Could not load exhibition report." });
      }

      console.log('Raw Exhibition Data:', results);

      // If no results or no data is available
      if (results.length === 0 || !results[0]) {
        return res.status(404).json({ message: "No exhibition data available" });
      }

      // Log the specific fields you're sending
      console.log('Exhibition Data:', results);

      // Send back the exhibition data
      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load exhibition report." });
  }
});

module.exports = router;
