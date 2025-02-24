import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showAddEdit } from "./addEdit.js";

let expensesList = null;

export const handleExpenses = () => {
  expensesList = document.getElementById("expenses-list");
  const logoffBtn = document.getElementById("logoff");

  // Logoff button click handler
  logoffBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html"; // Redirect to login page
  });

  // Display expenses
  fetchExpenses();
};

const fetchExpenses = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch("/api/v1/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const expenses = await response.json();
    renderExpenses(expenses);
  } catch (error) {
    console.error(error);
    expensesList.innerHTML = "<p>Error loading expenses.</p>";
  }
};

const renderExpenses = (expenses) => {
  expensesList.innerHTML = ""; // Clear existing list
  if (expenses.length === 0) {
    expensesList.innerHTML = "<p>No expenses found.</p>";
    return;
  }

  expenses.forEach(expense => {
    const expenseDiv = document.createElement("div");
    expenseDiv.innerHTML = `
      <p><strong>${expense.title}</strong> - $${expense.amount} (${expense.category})</p>
      <button onclick="editExpense('${expense._id}')">Edit</button>
      <button onclick="deleteExpense('${expense._id}')">Delete</button>
      <hr>
    `;
    expensesList.appendChild(expenseDiv);
  });
};

// Edit expense handler
window.editExpense = (expenseId) => {
  showAddEdit(expenseId); // Show the form for editing
};

// Delete expense handler
window.deleteExpense = async (expenseId) => {
  const confirmDelete = confirm("Are you sure you want to delete this expense?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`/api/v1/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchExpenses(); // Refresh the expense list
    } else {
      alert("Failed to delete expense");
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    alert("Error deleting expense.");
  }
};

// Add Expense handler
export const addExpense = async () => {
  const title = document.getElementById("expense-title").value;
  const amount = document.getElementById("expense-amount").value;
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;

  // Validate the fields
  if (!title || !amount || !category || !date) {
    message.textContent = "All fields are required!";
    return;
  }

  try {
    const response = await fetch("/api/v1/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, amount, category, date }),
    });

    if (response.ok) {
      message.textContent = "Expense added successfully!";
      fetchExpenses(); // Reload expense list
    } else {
      const data = await response.json();
      message.textContent = `Error: ${data.error}`;
    }
  } catch (error) {
    console.error("Error:", error);
    message.textContent = "An error occurred.";
  }
};
