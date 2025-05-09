import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("register-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form["register-email"].value;
  const password = form["register-password"].value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Pendaftaran berjaya!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Gagal daftar: " + error.message);
  }
});