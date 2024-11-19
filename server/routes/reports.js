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
  const validStart = start > today ? today : start;
  return {
    startDate: validStart.toISOString().split("T")[0],
    endDate: validEnd.toISOString().split("T")[0],
  };
};

router.get("/popularity", async (req, res) => {
  const query = `
    SELECT 
      e.name AS exhibition_name,
      e.start_date,  -- Display exhibition start date
      e.end_date,    -- Display exhibition end date
      DATE(ct.date_purchased) AS date_purchased,  -- Include the date the ticket was purchased
      COUNT(DISTINCT ct.customer_ticket_id) AS total_visitors
    FROM Exhibition e
    LEFT JOIN Customer_Exhibition ce ON e.exhibit_id = ce.exhibition_id
    LEFT JOIN Customer_Ticket ct ON ce.customer_id = ct.customer_id
    WHERE ct.is_deleted = 0
    GROUP BY 
      e.exhibit_id,
      e.name,
      e.start_date,
      e.end_date,
      DATE(ct.date_purchased)  -- Group by start date, end date, and date_purchased
    ORDER BY 
      date_purchased DESC,  -- Order by date purchased
      total_visitors DESC;  -- Then order by total_visitors
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve popularity report" });
    }
    res.json(results);
  });
});

// Employee Report
router.get("/employees", async (req, res) => {
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

  try {
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error in employee report:", error);
        res.status(500).json({ error: "Failed to retrieve employee report." });
      } else {
        const employeeMap = new Map();
        results.forEach((row) => {
          const employeeId = row.employee_id;
          if (!employeeMap.has(employeeId)) {
            employeeMap.set(employeeId, {
              name: `${row.first_name} ${
                row.middle_initial ? row.middle_initial + ". " : ""
              }${row.last_name}`,
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
        res.status(200).json(formattedData);
      }
    });
  } catch (err) {
    console.error("Error in employee report:", err);
    res.status(500).json({ error: "Failed to retrieve employee report." });
  }
});

// Ticket Revenue Report
router.get("/ticket-revenue", async (req, res) => {
  let { startDate, endDate } = req.query;
  const validDates = validateDates(startDate, endDate);
  const query = `
      SELECT 
        e.name AS exhibition_name,
        DATE(ct.date_purchased) AS date_purchased,
        COUNT(ct.customer_ticket_id) AS tickets_sold,
        SUM(ct.amount_spent) AS total_revenue
      FROM Exhibition e
      JOIN Customer_Exhibition ce ON e.exhibit_id = ce.exhibition_id
      JOIN Customer_Ticket ct ON ce.customer_id = ct.customer_id -- Join using customer_id
      WHERE 
        DATE(ct.date_purchased) BETWEEN '2024-10-17' AND '2024-11-17'
        AND ct.is_deleted = 0
      GROUP BY 
        e.exhibit_id,
        e.name,
        DATE(ct.date_purchased)
      ORDER BY 
        date_purchased DESC,
        total_revenue DESC;
  `;

  try {
    db.query(
      query,
      [validDates.startDate, validDates.endDate],
      (error, results) => {
        if (error) {
          console.error("Error in ticket revenue report:", error);
          res
            .status(500)
            .json({ error: "Failed to retrieve ticket revenue report." });
        } else {
          res.status(200).json(results);
        }
      }
    );
  } catch (err) {
    console.error("Error in ticket revenue report:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve ticket revenue report." });
  }
});

// Product Revenue Report
router.get("/product-revenue", async (req, res) => {
  let { startDate, endDate } = req.query;
  const validDates = validateDates(startDate, endDate);
  const query = `
    SELECT 
      p.name AS product_name,
      pc.name AS category_name,
      DATE(cp.date_purchased) AS date_purchased,
      COUNT(DISTINCT cp.customer_product_id) AS orders,
      SUM(cp.quantity) AS quantity,
      SUM(cp.amount_spent) AS total_revenue
    FROM Product p
    JOIN Product_Category pc ON p.product_category_id = pc.product_category_id
    JOIN Customer_Product cp ON p.product_id = cp.product_id
    WHERE 
      DATE(cp.date_purchased) BETWEEN ? AND ?
      AND cp.is_deleted = 0
    GROUP BY 
      p.product_id,
      p.name,
      pc.name,
      DATE(cp.date_purchased)
    ORDER BY 
      date_purchased DESC,
      total_revenue DESC;
  `;

  try {
    db.query(
      query,
      [validDates.startDate, validDates.endDate],
      (error, results) => {
        if (error) {
          console.error("Error in product revenue report:", error);
          res
            .status(500)
            .json({ error: "Failed to retrieve product revenue report." });
        } else {
          res.status(200).json(results);
        }
      }
    );
  } catch (err) {
    console.error("Error in product revenue report:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve product revenue report." });
  }
});

module.exports = router;
