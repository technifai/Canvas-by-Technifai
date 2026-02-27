import { auth, db } from "./firebase-config.js";
import {
  doc,
  collection,
  setDoc,
  addDoc,
  onSnapshot,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 140;

const roomId = new URLSearchParams(window.location.search).get("id");

const usersRef = collection(db,"rooms",roomId,"users");
const strokesRef = collection(db,"rooms",roomId,"strokes");
const cursorsRef = collection(db,"rooms",roomId,"cursors");

let userId;
let drawing=false;
let lastX=0,lastY=0;
let strokeBatch=[];
let cursorCooldown=false;

auth.onAuthStateChanged(async user=>{
  userId=user.uid;
  document.getElementById("roomInfo").innerText="Room ID: "+roomId;

  await setDoc(doc(usersRef,userId),{joined:Date.now()});

  onSnapshot(usersRef,snap=>{
    document.getElementById("userCount").innerText="Users: "+snap.size;
    snap.docChanges().forEach(change=>{
      if(change.type==="added"&&change.doc.id!==userId)
        notify("User joined");
      if(change.type==="removed")
        notify("User left");
    });
  });

  onSnapshot(strokesRef,snap=>{
    snap.docChanges().forEach(change=>{
      const data=change.doc.data();
      data.strokes.forEach(s=>{
        ctx.beginPath();
        ctx.lineWidth=3;
        ctx.lineCap="round";
        ctx.strokeStyle="#000";
        ctx.moveTo(s.x1,s.y1);
        ctx.lineTo(s.x2,s.y2);
        ctx.stroke();
      });
    });
  });

  onSnapshot(cursorsRef,snap=>{
    const layer=document.getElementById("cursorLayer");
    layer.innerHTML="";
    snap.forEach(docSnap=>{
      if(docSnap.id===userId) return;
      const d=docSnap.data();
      const dot=document.createElement("div");
      dot.className="cursor";
      dot.style.left=d.x+"px";
      dot.style.top=d.y+"px";
      layer.appendChild(dot);
    });
  });

  window.addEventListener("beforeunload",async()=>{
    await deleteDoc(doc(usersRef,userId));
  });
});

canvas.onmousedown=e=>{
  drawing=true;
  lastX=e.offsetX;
  lastY=e.offsetY;
};

canvas.onmousemove=e=>{
  updateCursor(e.offsetX,e.offsetY);
  if(!drawing) return;

  ctx.beginPath();
  ctx.lineWidth=3;
  ctx.lineCap="round";
  ctx.moveTo(lastX,lastY);
  ctx.lineTo(e.offsetX,e.offsetY);
  ctx.stroke();

  strokeBatch.push({x1:lastX,y1:lastY,x2:e.offsetX,y2:e.offsetY});
  lastX=e.offsetX;
  lastY=e.offsetY;
};

canvas.onmouseup=async()=>{
  drawing=false;
  if(strokeBatch.length>0){
    await addDoc(strokesRef,{strokes:strokeBatch});
    strokeBatch=[];
  }
};

async function updateCursor(x,y){
  if(cursorCooldown) return;
  cursorCooldown=true;
  await setDoc(doc(cursorsRef,userId),{x,y});
  setTimeout(()=>cursorCooldown=false,100);
}

document.getElementById("shareBtn").onclick=()=>{
  navigator.clipboard.writeText(window.location.href);
  notify("Invite link copied");
};

function notify(msg){
  const div=document.createElement("div");
  div.className="notification";
  div.innerText=msg;
  document.getElementById("notificationContainer")
    .appendChild(div);
  setTimeout(()=>div.remove(),3000);
}
