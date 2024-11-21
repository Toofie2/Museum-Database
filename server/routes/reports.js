const express = require("express");
const router = express.Router();
const db = require("../db");

const validateDates = (startDate, endDate) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  if (!startDate || !endDate) {
    return {
      startDate: monthAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      startDate: monthAgo.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    };
  }
  const validEnd = end > today ? today : end;
  const validStart = start > validEnd ? validEnd : start;
  return {
    startDate: validStart.toISOString().split("T")[0],
    endDate: validEnd.toISOString().split("T")[0],
  };
};

router.get("/popularity", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const validDates = validateDates(startDate, endDate);
    console.log("Fetching popularity data for dates:", validDates);

    const query = `
        SELECT 
          e.name AS exhibition_name,
          e.start_date,
          e.end_date,
          DATE(ce.valid_day) AS date_purchased,
          COUNT(DISTINCT ce.customer_exhibition_id) AS total_visitors,
          ROUND(AVG(r.rating), 1) AS average_rating,
          COUNT(r.rating) AS review_count
        FROM Exhibition e
        INNER JOIN Customer_Exhibition ce ON e.exhibit_id = ce.exhibition_id
        LEFT JOIN Review r ON e.exhibit_id = r.exhibit_id 
          AND r.rating IS NOT NULL
        WHERE ce.valid_day BETWEEN ? AND ?
        GROUP BY
          e.name,
          e.start_date,
          e.end_date,
          DATE(ce.valid_day)
        ORDER BY
          date_purchased DESC,
          total_visitors DESC;
    `;

    db.query(query, [validDates.startDate, validDates.endDate, validDates.startDate, validDates.endDate], (err, results) => {
      if (err) {
        console.error("Database error in popularity:", err);
        return res.status(500).json({ error: "Failed to retrieve popularity report" });
      }

    const processedResults = results.map(row => ({
      ...row,
      average_rating: row.average_rating !== null ? parseFloat(row.average_rating.toFixed(1)) : null
    }));

      console.log("Popularity results:", processedResults);
      res.json(processedResults);
    });
  } catch (err) {
    console.error("Error in popularity route:", err);
    res.status(500).json({ error: "Failed to retrieve popularity report" });
  }
});

router.get("/ticket-revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const validDates = validateDates(startDate, endDate);
    console.log("Fetching ticket revenue for dates:", validDates);

    const query = `
      SELECT 
        DATE(ct.date_purchased) AS date,
        COUNT(ct.customer_ticket_id) AS tickets_sold,
        SUM(ct.amount_spent) AS ticket_revenue
      FROM Customer_Ticket ct
      WHERE ct.is_deleted = 0 
      AND DATE(ct.date_purchased) BETWEEN ? AND ?
      GROUP BY DATE(ct.date_purchased)
      ORDER BY date DESC;
      `;

    db.query(query, [validDates.startDate, validDates.endDate], (err, results) => {
      if (err) {
        console.error("Database error in ticket revenue:", err);
        return res.status(500).json({ error: "Failed to retrieve ticket revenue" });
      }
      console.log("Ticket revenue results:", results);
      res.json(results);
    });
  } catch (err) {
    console.error("Error in ticket revenue route:", err);
    res.status(500).json({ error: "Failed to retrieve ticket revenue" });
  }
});

router.get("/product-revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const validDates = validateDates(startDate, endDate);
    console.log("Fetching product revenue for dates:", validDates);

    const query = `
      SELECT 
        DATE(cp.date_purchased) AS date,
        COUNT(DISTINCT cp.customer_product_id) AS quantity,
        SUM(cp.amount_spent) AS product_revenue
      FROM Customer_Product cp
      WHERE cp.is_deleted = 0 
      AND DATE(cp.date_purchased) BETWEEN ? AND ?
      GROUP BY DATE(cp.date_purchased)
      ORDER BY date DESC;
    `;

    db.query(query, [validDates.startDate, validDates.endDate], (err, results) => {
      if (err) {
        console.error("Database error in product revenue:", err);
        return res.status(500).json({ error: "Failed to retrieve product revenue" });
      }
      console.log("Product revenue results:", results);
      res.json(results);
    });
  } catch (err) {
    console.error("Error in product revenue route:", err);
    res.status(500).json({ error: "Failed to retrieve product revenue" });
  }
});

router.get("/employees", async (req, res) => {
  try {
    console.log("Fetching employee data");

    const query = `
      SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        e.middle_initial,
        e.hire_date,
        et.name AS task_name,
        et.description AS task_description,
        d.name AS department_name
      FROM Employee e
      JOIN Department d ON e.department_id = d.department_id
      LEFT JOIN Employee_Task et ON e.employee_id = et.employee_id
      WHERE e.is_active = 1
      GROUP BY
        e.employee_id,
        e.first_name,
        e.last_name,
        e.middle_initial,
        e.hire_date,
        et.name,
        et.description,
        d.name
      ORDER BY 
        d.name,
        e.last_name,
        e.first_name;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error in employees:", err);
        return res.status(500).json({ error: "Failed to retrieve employee data" });
      }

      const employeeMap = new Map();
      results.forEach((row) => {
        const employeeId = row.employee_id;
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            name: `${row.first_name} ${row.middle_initial ? row.middle_initial + ". " : ""}${row.last_name}`,
            department: row.department_name,
            hire_date: row.hire_date,
            tasks: [],
          });
        }

        if (row.task_name && row.task_description) {
          employeeMap.get(employeeId).tasks.push({
            name: row.task_name,
            description: row.task_description,
          });
        }
      });

      const formattedData = Array.from(employeeMap.values());
      console.log("Employee results:", formattedData);
      res.json(formattedData);
    });
  } catch (err) {
    console.error("Error in employee route:", err);
    res.status(500).json({ error: "Failed to retrieve employee data" });
  }
});

module.exports = router;