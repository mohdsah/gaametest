import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGFV1ThnWNm5pMMeOycnoEenu0WdmxStM",
  authDomain: "jomsembang-bd0ae.firebaseapp.com",
  databaseURL: "https://jomsembang-bd0ae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jomsembang-bd0ae",
  storageBucket: "jomsembang-bd0ae.appspot.com",
  messagingSenderId: "289568738195",
  appId: "1:289568738195:web:b0a312e89dbf7854983666",
  measurementId: "G-FZTEVGD8N1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };