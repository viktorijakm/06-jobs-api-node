const registerForm = document.getElementById("registerForm");
const responseDiv = document.getElementById("response");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Save token to localStorage and redirect
      localStorage.setItem("token", data.token);
      responseDiv.textContent = "Registration successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "expenses.html"; // or dashboard page
      }, 1000);
    } else {
      responseDiv.textContent = data.msg || "Failed to register.";
    }
  } catch (err) {
    console.error(err);
    responseDiv.textContent = "Error registering user.";
  }
});
