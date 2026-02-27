import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBliy4yWuGiyQhQkxc0GSfQiwjnwPbTb4o",
  authDomain: "canvas-technifai.firebaseapp.com",
  projectId: "canvas-technifai",
  storageBucket: "canvas-technifai.firebasestorage.app",
  messagingSenderId: "967579356251",
  appId: "1:967579356251:web:439cd795ed88a74131c37e",
  measurementId: "G-FLD9089JMR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
