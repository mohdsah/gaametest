import { auth } from "../firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "feed.html";
      })
      .catch(err => alert(err.message));
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Akaun berjaya didaftar!");
        window.location.href = "index.html";
      })
      .catch(err => alert(err.message));
  });
}