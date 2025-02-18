let activeDiv = null;

// Switch between divs
export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;

// Enable or disable inputs
export const enableInput = (state) => {
  inputEnabled = state;
};

// Token handling
export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

// Message element for feedback
export let message = null;

// Importing necessary handlers
import { showJobs, handleJobs } from "./jobs.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");

  handleLoginRegister();
  handleLogin();
  handleJobs();
  handleRegister();

  if (token) {
    console.log("Token found! Redirecting to expenses page...");
    window.location.href = "expenses.html";
  } else {
    console.log("No token found. Showing login/register...");
    showLoginRegister();
  }
});
