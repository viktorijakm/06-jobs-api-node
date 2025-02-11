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

router.route("/")
.get(getAllExpenses)
.post(createExpense);

router.route("/:id")
  .get(getSingleExpense)
  .patch(updateExpense)
  .delete(deleteExpense);

module.exports = router;
