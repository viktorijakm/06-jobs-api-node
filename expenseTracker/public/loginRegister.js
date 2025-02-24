import { inputEnabled, setDiv } from "./index.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";

let loginRegisterDiv = null;

export const handleLoginRegister = () => {
  loginRegisterDiv = document.getElementById("logon-register");
  
  if (!loginRegisterDiv) {
    console.error("Login/Register div not found");
    return;
  }

  document.getElementById("logon").addEventListener("click", () => {
    if (inputEnabled) handleLogin();
  });

  document.getElementById("register").addEventListener("click", () => {
    if (inputEnabled) handleRegister();
  });
};

export const showLoginRegister = () => {
  if (loginRegisterDiv) {
    setDiv(loginRegisterDiv);
  } else {
    console.error("Cannot show login/register. Div not initialized.");
  }
};
