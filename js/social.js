import { db } from "./firebase-config.js";
import { collection, addDoc }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("createBtn").onclick = async () => {
  const docRef = await addDoc(collection(db,"rooms"), {
    createdAt: Date.now()
  });
  window.location.href = "room.html?id=" + docRef.id;
};

document.getElementById("joinBtn").onclick = () => {
  const id = document.getElementById("roomInput").value;
  window.location.href = "room.html?id=" + id;
};
