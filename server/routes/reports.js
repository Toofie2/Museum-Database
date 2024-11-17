const express = require('express');
const router = express.Router();
const db = require('../db');

// Utility function to validate dates
const validateDates = (startDate, endDate) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  // If no dates provided, use default range
  if (!startDate || !endDate) {
    return {
      startDate: monthAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  }
  
  // Convert strings to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If either date is invalid, use default range
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      startDate: monthAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  }
  
  // If dates are in the future, cap them at today
  const validEnd = end > today ? today : end;
  const validStart = start > today ? today : start;
  
  return {
    startDate: validStart.toISOString().split('T')[0],
    endDate: validEnd.toISOString().split('T')[0]
  };
};

// Popularity Report
router.get('/popularity', async (req, res) => {
  const query = `
SELECT 
    e.name AS exhibition_name,
    e.start_date AS exhibition_start_date,
    e.end_date AS exhibition_end_date,
    COUNT(DISTINCT ce.customer_exhibition_id) AS total_customers_visited,
    c.first_name,
    c.middle_initial,
    c.last_name,
    COUNT(ce.customer_exhibition_id) AS visit_frequency,
    ce.valid_day
FROM 
    Customer_Exhibition ce
JOIN 
    Customer_Ticket ct ON ce.customer_exhibition_id = ct.customer_ticket_id
JOIN 
    Exhibition e ON ce.exhibition_id = e.exhibit_id
JOIN 
    Customer c ON ct.customer_id = c.customer_id
WHERE 
    ce.valid_day BETWEEN '2024-01-01' AND '2024-12-31'  -- Adjust the date range as needed
    AND ct.is_deleted = 0  -- Ensure the ticket is not deleted
    AND e.is_active = 1    -- Ensure the exhibition is active
    AND c.is_active = 1    -- Ensure the customer is active
GROUP BY 
    e.exhibit_id, ce.valid_day, c.customer_id
ORDER BY 
    ce.valid_day, exhibition_start_date;

;
  `;

  try {
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error in popularity report:', error);
        res.status(500).json({ error: 'Failed to retrieve exhibition popularity report.' });
      } else {
        res.status(200).json(results);
      }
    });
  } catch (err) {
    console.error('Error in popularity report:', err);
    res.status(500).json({ error: 'Failed to retrieve exhibition popularity report.' });
  }
});

// Employee Report
router.get('/employees', async (req, res) => {
  const query = `
    SELECT 
    e.first_name, 
    e.last_name, 
    COUNT(et.employee_task_id) AS tasks_assigned
FROM 
    Employee e
LEFT JOIN 
    Employee_Task et ON e.employee_id = et.employee_id
GROUP BY 
    e.employee_id;
  `;

  try {
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error in employee report:', error);
        res.status(500).json({ error: 'Failed to retrieve employee report.' });
      } else {
        // Transform the data to group tasks by employee
        const employeeMap = new Map();
        
        results.forEach(row => {
          const employeeId = row.employee_id;
          if (!employeeMap.has(employeeId)) {
            employeeMap.set(employeeId, {
              name: `${row.first_name} ${row.middle_initial ? row.middle_initial + '. ' : ''}${row.last_name}`,
              department: row.department_name,
              email: row.email,
              tasks: []
            });
          }
          
          if (row.task_name && row.task_description) {
            employeeMap.get(employeeId).tasks.push({
              name: row.task_name,
              description: row.task_description
            });
          }
        });

        const formattedData = Array.from(employeeMap.values());
        res.status(200).json(formattedData);
      }
    });
  } catch (err) {
    console.error('Error in employee report:', err);
    res.status(500).json({ error: 'Failed to retrieve employee report.' });
  }
});

// Ticket Revenue Report
router.get('/ticket-revenue', async (req, res) => {
  let { startDate, endDate } = req.query;
  
  // Validate and adjust dates if necessary
  const validDates = validateDates(startDate, endDate);
  
  const query = `
   SELECT
  e.exhibit_id,
  e.name AS exhibition_name,
  SUM(ct.amount_spent) AS ticket_revenue,
  (SUM(ct.amount_spent)) AS total_revenue,
  ct.date_purchased
FROM Exhibition e
LEFT JOIN Customer_Exhibition ce ON ce.exhibition_id = e.exhibit_id
LEFT JOIN Customer_Ticket ct ON ct.customer_ticket_id = ce.customer_exhibition_id
WHERE e.is_active = 1
GROUP BY e.exhibit_id, ct.date_purchased
ORDER BY total_revenue DESC;
  `;

  try {
    db.query(query, [validDates.startDate, validDates.endDate], (error, results) => {
      if (error) {
        console.error('Error in ticket revenue report:', error);
        res.status(500).json({ error: 'Failed to retrieve ticket revenue report.' });
      } else {
        res.status(200).json(results);
      }
    });
  } catch (err) {
    console.error('Error in ticket revenue report:', err);
    res.status(500).json({ error: 'Failed to retrieve ticket revenue report.' });
  }
});

// Product Revenue Report
router.get('/product-revenue', async (req, res) => {
  let { startDate, endDate } = req.query;
  
  // Validate and adjust dates if necessary
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
    db.query(query, [validDates.startDate, validDates.endDate], (error, results) => {
      if (error) {
        console.error('Error in product revenue report:', error);
        res.status(500).json({ error: 'Failed to retrieve product revenue report.' });
      } else {
        res.status(200).json(results);
      }
    });
  } catch (err) {
    console.error('Error in product revenue report:', err);
    res.status(500).json({ error: 'Failed to retrieve product revenue report.' });
  }
});

module.exports = router;
