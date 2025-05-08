import { firebaseConfig } from "../firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  getCountFromServer,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Semak login
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadPosts(user);
  } else {
    window.location.href = "index.html";
  }
});

// Fungsi muatkan pos
async function loadPosts(user) {
  const postList = document.getElementById("postList");
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const postId = docSnap.id;

    // Ambil bilangan like
    const likeRef = collection(db, "posts", postId, "likes");
    const likeSnap = await getCountFromServer(likeRef);
    const likeCount = likeSnap.data().count;

    const postDiv = document.createElement("div");
    postDiv.style.border = "1px solid #ccc";
    postDiv.style.padding = "10px";
    postDiv.style.margin = "10px 0";

    postDiv.innerHTML = `
      <p><strong>${data.author}</strong></p>
      <p>${data.content || ""}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width:100%;">` : ""}
      <p>
        <button data-id="${postId}">Like</button>
        <span>${likeCount} suka</span>
      </p>
      <small>${data.timestamp?.toDate().toLocaleString() || ""}</small>
    `;

    // Butang Like
    const likeBtn = postDiv.querySelector("button");
    likeBtn.addEventListener("click", async () => {
      const likeDoc = doc(db, "posts", postId, "likes", user.uid);
      await setDoc(likeDoc, { liked: true });
      location.reload(); // Refresh untuk update kiraan like
    });

    postList.appendChild(postDiv);
  }
}
