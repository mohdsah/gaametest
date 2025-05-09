import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elemen UI
const postForm = document.getElementById("post-form");
const postContent = document.getElementById("post-content");
const feed = document.getElementById("feed");

// Auth check
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadPosts(user);
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = postContent.value.trim();
      if (content) {
        await addDoc(collection(db, "posts"), {
          content,
          timestamp: new Date(),
          author: user.email
        });
        postContent.value = "";
      }
    });
  }
});

// Load posts & listen live
function loadPosts(currentUser) {
  const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(postsQuery, (snapshot) => {
    feed.innerHTML = "";
    snapshot.forEach((doc) => {
      const post = doc.data();
      const postId = doc.id;
      const postEl = document.createElement("div");
      postEl.classList.add("post");
      postEl.innerHTML = `
        <p><strong>${post.author}</strong><br>${post.content}</p>
        <div class="comments" id="comments-${postId}"></div>
        <form class="comment-form" data-id="${postId}">
          <input type="text" placeholder="Tulis komen..." required />
          <button type="submit">Komen</button>
        </form>
      `;
      feed.appendChild(postEl);

      // Load komen
      loadComments(postId);

      // Submit komen
      const commentForm = postEl.querySelector(".comment-form");
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = commentForm.querySelector("input");
        const comment = input.value.trim();
        if (comment) {
          await addDoc(collection(db, `posts/${postId}/comments`), {
            comment,
            author: currentUser.email,
            timestamp: new Date()
          });
          input.value = "";
        }
      });
    });
  });
}

// Load comments
function loadComments(postId) {
  const commentsRef = collection(db, `posts/${postId}/comments`);
  const commentsQuery = query(commentsRef, orderBy("timestamp", "asc"));
  const commentsEl = document.getElementById(`comments-${postId}`);

  onSnapshot(commentsQuery, (snapshot) => {
    commentsEl.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const p = document.createElement("p");
      p.innerHTML = `<strong>${data.author}</strong>: ${data.comment}`;
      commentsEl.appendChild(p);
    });
  });
}
