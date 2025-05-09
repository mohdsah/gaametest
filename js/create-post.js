import { auth, firebaseConfig } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Initialize Firebase App & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Semak status login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Hantar pos bila klik butang
  document.getElementById("submitBtn").addEventListener("click", async () => {
    const content = document.getElementById("postContent").value.trim();
    const status = document.getElementById("status");

    if (!content) {
      status.textContent = "Sila isi kandungan pos.";
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        content,
        author: user.email,
        timestamp: serverTimestamp()
      });
      status.textContent = "Pos berjaya dihantar!";
      document.getElementById("postContent").value = "";
    } catch (error) {
      status.textContent = "Ralat semasa menghantar pos.";
      console.error(error);
    }
  });
});