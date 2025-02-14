const Expense = require("../models/Expense");

const getAllExpenses = async (req, res) => {
  try {

    console.log("Fetching expenses for user:", req.user);
    
    const expenses = await Expense.find({ createdBy: req.user.userId });

    console.log("Expenses found:", expenses);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const createExpense = async (req, res) => {
  try {

    console.log("Received Expense Data:", req.body); 
    console.log("User Info:", req.user);

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized - No valid user" });
    }

    const { title, amount, category, date } = req.body;

    // Check for missing fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      createdBy: req.user.userId
    });

    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (err) {

    console.error("Expense Creation Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getSingleExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ error: "Expense not found or not authorized" });
    }

    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ error: "Expense not found or not authorized" });
    }

    expense.title = req.body.title || expense.title;
    expense.amount = req.body.amount || expense.amount;
    expense.category = req.body.category || expense.category;
    expense.date = req.body.date || expense.date;

    await expense.save();

    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ error: "Expense not found or not authorized" });
    }

    await expense.remove();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllExpenses,
  createExpense,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};
