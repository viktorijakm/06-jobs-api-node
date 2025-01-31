//defines routes for handling requests related to expenses
const express = require("express");
const router = express.Router();

const {
  getAllExpenses,
  createExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const verifyToken = require("../middleware/auth");

// Get All Expenses (GET /api/expenses)
router.get("/", verifyToken, getAllExpenses);

// Create an Expense (POST /api/expenses)
router.post("/", verifyToken, createExpense);

// Get a Single Expense (GET /api/expenses/:id)
router.get("/:id", verifyToken, getSingleExpense);

// Update an Expense (PATCH /api/expenses/:id)
router.patch("/:id", verifyToken, updateExpense);

// Delete an Expense (DELETE /api/expenses/:id)
router.delete("/:id", verifyToken, deleteExpense);

module.exports = router;
