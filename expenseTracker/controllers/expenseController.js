const Expense = require('../models/Expense');

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ createdBy: req.user._id }); 
        res.status(200).json(expenses); 
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        const newExpense = new Expense({
            title,
            amount,
            category,
            date,
            createdBy: req.user._id  
        });

        await newExpense.save(); 

        res.status(201).json(newExpense); 
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getSingleExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            createdBy: req.user._id 
        });

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }

        res.status(200).json(expense); 
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            createdBy: req.user._id 
        });

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }

        expense.title = req.body.title || expense.title;
        expense.amount = req.body.amount || expense.amount;
        expense.category = req.body.category || expense.category;
        expense.date = req.body.date || expense.date;

        await expense.save(); 

        res.status(200).json(expense);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            createdBy: req.user._id 
        });

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }

        await expense.remove(); 

        res.status(200).json({ message: 'Expense deleted successfully' }); 
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllExpenses, createExpense, getSingleExpense, updateExpense, deleteExpense };
