import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Semak sama ada pengguna login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const postForm = document.getElementById("post-form");
const postContent = document.getElementById("post-content");
const feed = document.getElementById("feed");
const logoutBtn = document.getElementById("logout-btn");

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Hantar post baru
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = postContent.value.trim();
  if (!content) return;

  try {
    await addDoc(collection(db, "posts"), {
      content,
      author: auth.currentUser.email,
      timestamp: serverTimestamp(),
      comments: []
    });
    postContent.value = "";
  } catch (error) {
    alert("Ralat: " + error.message);
  }
});

// Papar semua post secara langsung
const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  feed.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const post = docSnap.data();
    const postId = docSnap.id;
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
      <p><strong>${post.author}</strong></p>
      <p>${post.content}</p>
      <div class="comments">
        ${(post.comments || [])
          .map(
            (c) =>
              `<p><strong>${c.author}:</strong> ${c.text}</p>`
          )
          .join("")}
        <form class="comment-form" data-id="${postId}">
          <input type="text" placeholder="Tulis komen..." required />
          <button type="submit">Komen</button>
        </form>
      </div>
    `;
    feed.appendChild(postDiv);
  });
});

// Tambah komen
feed.addEventListener("submit", async (e) => {
  if (!e.target.classList.contains("comment-form")) return;
  e.preventDefault();

  const form = e.target;
  const input = form.querySelector("input");
  const commentText = input.value.trim();
  if (!commentText) return;

  const postId = form.getAttribute("data-id");
  const postRef = doc(db, "posts", postId);

  try {
    await updateDoc(postRef, {
      comments: arrayUnion({
        text: commentText,
        author: auth.currentUser.email,
        timestamp: new Date().toISOString()
      })
    });
    input.value = "";
  } catch (error) {
    alert("Gagal tambah komen: " + error.message);
  }
});