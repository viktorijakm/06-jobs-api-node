const Expense = require('../models/Expense')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.userId }).sort('date')
  res.status(StatusCodes.OK).json({ expenses, count: expenses.length })
}

const createExpense = async (req, res) => {
  req.body.user = req.user.userId
  const expense = await Expense.create(req.body)
  res.status(StatusCodes.CREATED).json({ expense })
}

const getExpense = async (req, res) => {
  const { id: expenseId } = req.params
  const expense = await Expense.findOne({ _id: expenseId, user: req.user.userId })
  if (!expense) throw new NotFoundError(`No expense with id ${expenseId}`)
  res.status(StatusCodes.OK).json({ expense })
}

const updateExpense = async (req, res) => {
  const { id: expenseId } = req.params
  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, user: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!expense) throw new NotFoundError(`No expense with id ${expenseId}`)
  res.status(StatusCodes.OK).json({ expense })
}

const deleteExpense = async (req, res) => {
  const { id: expenseId } = req.params
  const expense = await Expense.findOneAndDelete({ _id: expenseId, user: req.user.userId })
  if (!expense) throw new NotFoundError(`No expense with id ${expenseId}`)
  res.status(StatusCodes.OK).send()
}

module.exports = { getAllExpenses, createExpense, getExpense, updateExpense, deleteExpense }
