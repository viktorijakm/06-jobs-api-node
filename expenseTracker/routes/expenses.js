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

// Import the authMiddleware to protect the routes
const authMiddleware = require("../middleware/auth");

router.route("/")
.get(authMiddleware,getAllExpenses)
.post(authMiddleware, createExpense);


router.route("/:id")
  .get(authMiddleware,getSingleExpense)
  .patch(authMiddleware, updateExpense)
  .delete(authMiddleware, deleteExpense);

module.exports = router;
