import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form["login-email"].value;
  const password = form["login-password"].value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "feed.html";
  } catch (error) {
    alert("Login gagal: " + error.message);
  }
});