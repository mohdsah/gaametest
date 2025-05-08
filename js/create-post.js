import { auth, firebaseConfig } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Check login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("submitBtn").addEventListener("click", async () => {
    const content = document.getElementById("postContent").value.trim();
    const imageFile = document.getElementById("imageInput").files[0];
    const status = document.getElementById("status");

    if (!content && !imageFile) {
      status.textContent = "Sila masukkan teks atau gambar.";
      return;
    }

    status.textContent = "Menghantar pos...";

    let imageUrl = "";
    if (imageFile) {
      const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(db, "posts"), {
        content,
        imageUrl,
        author: user.email,
        timestamp: serverTimestamp()
      });

      status.textContent = "Pos berjaya dihantar!";
      document.getElementById("postContent").value = "";
      document.getElementById("imageInput").value = "";
    } catch (err) {
      console.error(err);
      status.textContent = "Ralat semasa menyimpan pos.";
    }
  });
});
