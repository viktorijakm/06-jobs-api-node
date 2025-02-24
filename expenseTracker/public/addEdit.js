import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showExpenses } from "./expenses.js";

let addEditDiv = null;
let title = null;
let amount = null;
let category = null;
let date = null;
let addingExpense = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-expense");
  title = document.getElementById("title");
  amount = document.getElementById("amount");
  category = document.getElementById("category");
  date = document.getElementById("date");
  addingExpense = document.getElementById("adding-expense");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingExpense) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/expenses"; // Default to POST (Add new)

        if (addingExpense.textContent === "update") {
          method = "PATCH"; // Change to PATCH for updating
          url = `/api/v1/expenses/${addEditDiv.dataset.id}`; // Use the ID for the PATCH request
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              amount: parseFloat(amount.value),
              category: category.value,
              date: date.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            message.textContent = response.status === 200 ? "Expense updated." : "Expense added.";
            title.value = "";
            amount.value = "";
            category.value = "Food"; // Default category
            date.value = "";
            showExpenses(); // Refresh the list of expenses after add/edit
          } else {
            message.textContent = data.error || "An error occurred.";
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        console.log("Cancelling edit...");
        title.value = "";
        amount.value = "";
        category.value = "Food"; // Reset category to default
        date.value = "";
        addingExpense.textContent = "add"; // Reset button text to "add"
        message.textContent = "";
        delete addEditDiv.dataset.id; // Remove expense ID from dataset
        setDiv(addEditDiv); // Reset div state
      }
    }
  });
};

// This function will be called to either display the add form or load the edit form
export const showAddEdit = async (expenseId) => {
  if (!expenseId) {
    title.value = "";
    amount.value = "";
    category.value = "Food"; // Default category
    date.value = "";
    addingExpense.textContent = "add"; // Set to Add by default
    message.textContent = "";
    delete addEditDiv.dataset.id;
    setDiv(addEditDiv);
  } else {
    enableInput(false); // Disable inputs while fetching data

    try {
      const response = await fetch(`/api/v1/expenses/${expenseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.title;
        amount.value = data.amount;
        category.value = data.category;
        date.value = data.date;
        addingExpense.textContent = "update"; // Change button text to "update"
        message.textContent = "";
        addEditDiv.dataset.id = expenseId; // Store the expense ID for update
        setDiv(addEditDiv); // Set div state for editing
      } else {
        message.textContent = "Expense entry not found.";
        showExpenses(); // Refresh list if not found
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
      showExpenses();
    }

    enableInput(true); // Re-enable inputs after fetching data
  }
};
