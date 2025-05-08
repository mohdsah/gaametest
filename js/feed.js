import { firebaseConfig } from "../firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ambil pos dari Firestore
async function loadPosts() {
  const postList = document.getElementById("postList");
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();
    const postDiv = document.createElement("div");
    postDiv.style.border = "1px solid #ccc";
    postDiv.style.padding = "10px";
    postDiv.style.margin = "10px 0";

    postDiv.innerHTML = `
      <p><strong>${data.author}</strong></p>
      <p>${data.content || ""}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Gambar" style="max-width: 100%; height: auto;">` : ""}
      <small>${data.timestamp?.toDate().toLocaleString() || ""}</small>
    `;

    postList.appendChild(postDiv);
  });
}

loadPosts();
