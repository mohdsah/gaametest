import { db, auth } from "./firebase-config.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const feedEl = document.getElementById("feed");
const logoutBtn = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
      feedEl.innerHTML = "";
      snapshot.forEach((docSnap) => {
        const post = docSnap.data();
        const postId = docSnap.id;
        const isLiked = post.likes?.includes(user.email);
        const likeText = `${isLiked ? "Unlike" : "Like"} (${post.likes?.length || 0})`;

        const postEl = document.createElement("div");
        postEl.classList.add("post");
        postEl.innerHTML = `
          <p><strong>${post.author}</strong></p>
          <p>${post.content}</p>
          <p><small>${new Date(post.timestamp?.toDate()).toLocaleString()}</small></p>
          <button class="like-btn" data-id="${postId}">${likeText}</button>
          <div class="comments" id="comments-${postId}"></div>
          <form class="comment-form" data-id="${postId}">
            <input type="text" placeholder="Tulis komen..." required />
            <button type="submit">Hantar</button>
          </form>
        `;
        feedEl.appendChild(postEl);

        // Papar komen
        const commentsEl = document.getElementById(`comments-${postId}`);
        (post.comments || []).forEach((comment) => {
          const commentEl = document.createElement("p");
          commentEl.innerHTML = `<small><strong>${comment.author}</strong>: ${comment.text}</small>`;
          commentsEl.appendChild(commentEl);
        });
      });
    });

    // Like/unlike handler
    feedEl.addEventListener("click", async (e) => {
      if (e.target.classList.contains("like-btn")) {
        const postId = e.target.dataset.id;
        const postRef = doc(db, "posts", postId);
        const snap = await getDoc(postRef);
        const likes = snap.data().likes || [];
        const updatedLikes = likes.includes(user.email)
          ? likes.filter((email) => email !== user.email)
          : [...likes, user.email];
        await updateDoc(postRef, { likes: updatedLikes });
      }
    });

    // Comment handler
    feedEl.addEventListener("submit", async (e) => {
      if (e.target.classList.contains("comment-form")) {
        e.preventDefault();
        const postId = e.target.dataset.id;
        const input = e.target.querySelector("input");
        const commentText = input.value.trim();
        if (!commentText) return;

        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        const oldComments = postSnap.data().comments || [];
        const newComment = {
          text: commentText,
          author: user.email,
          timestamp: new Date().toISOString()
        };

        await updateDoc(postRef, { comments: [...oldComments, newComment] });
        input.value = "";
      }
    });

    // Logout
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "login.html";
      });
    });
  } else {
    window.location.href = "login.html";
  }
});
