const express = require("express");
const router = express.Router();
const db = require("../db");

// GET products by product category id
router.get("/product_category/:product_category_id", (req, res) => {
  const { product_category_id } = req.params;

  db.query(
    "SELECT * FROM Product WHERE product_category_id = ? AND is_deleted = FALSE",
    [product_category_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// GET all products with category name
router.get("/", (req, res) => {
  const query = `
        SELECT Product.*, Product_Category.name as category_name 
        FROM Product 
        JOIN Product_Category ON Product.product_category_id = Product_Category.product_category_id 
        WHERE Product.is_deleted = FALSE
    `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET product by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Product WHERE product_id = ? AND is_deleted = FALSE",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length == 0) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// POST a new product
router.post("/", (req, res) => {
  const {
    name,
    description,
    price,
    image_path,
    product_category_id,
    quantity,
  } = req.body;
  const insertQuery =
    "INSERT INTO Product (name, description, price, image_path, product_category_id, quantity) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    insertQuery,
    [name, description, price, image_path, product_category_id, quantity],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// PUT (update) a product
router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  // Fetch product data
  const fetchQuery =
    "SELECT * FROM Product WHERE product_id = ? AND is_deleted = FALSE";
  db.query(fetchQuery, [productId], (fetchErr, fetchResult) => {
    if (fetchErr) {
      return res.status(500).json({ error: fetchErr.message });
    }
    if (fetchResult.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const currentProduct = fetchResult[0];
    // Merge the updates with the current data
    const updatedProduct = { ...currentProduct, ...updates };
    const {
      name,
      description,
      price,
      image_path,
      product_category_id,
      quantity,
    } = updatedProduct;
    const updateQuery =
      "UPDATE Product SET name = ?, description = ?, price = ?, image_path = ?, product_category_id = ?, quantity = ? WHERE product_id = ?";
    db.query(
      updateQuery,
      [
        name,
        description,
        price,
        image_path,
        product_category_id,
        quantity,
        productId,
      ],
      (updateErr, updateResult) => {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message });
        }
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json({ id: productId, ...updatedProduct });
      }
    );
  });
});

// Soft DELETE a product (change is_deleted to TRUE)
router.delete("/:id", (req, res) => {
  db.query(
    "UPDATE Product SET is_deleted = TRUE WHERE product_id = ? AND is_deleted= FALSE",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res
          .status(404)
          .json({ message: "Product not found or already deleted" });
        return;
      }
      res.json({ message: "Product successfully deleted" });
    }
  );
});

// Optional: Reactivate a product
router.patch("/:id/reactivate", (req, res) => {
  db.query(
    "UPDATE Product SET is_deleted = FALSE WHERE product_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json({ message: "Product successfully reactivated" });
    }
  );
});

module.exports = router;
