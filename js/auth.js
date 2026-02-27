import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "social.html";
};
