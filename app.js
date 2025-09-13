// ==========================
// Firebase Init
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  serverTimestamp, query, orderBy 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// 🔑 Config dari Firebase project kamu
const firebaseConfig = {
  apiKey: "AIzaSyBQwsuHKzxMlrmxGO2jrkQf9q2E2cCcD44",
  authDomain: "maxy-bootcamp-14405.firebaseapp.com",
  projectId: "maxy-bootcamp-14405",
  storageBucket: "maxy-bootcamp-14405.firebasestorage.app",
  messagingSenderId: "1011362869192",
  appId: "1:1011362869192:web:aa867236b2c49e9aa55afd",
  measurementId: "G-VC0MESJHXN"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ==========================
// Framework7 Init
// ==========================
const app7 = new Framework7({
  root: 'body',
  view: false,
  routes: [],                 
  touch: { fastClicks: false },
  on: {
    init() {
      // smooth scroll untuk anchor link (#id)
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  }
});

// ==========================
// Popups Login & Register
// ==========================
const loginPopup = app7.popup.create({
  el: '#login-popup',
  closeByBackdropClick: true,
  backdrop: true
});

const registerPopup = app7.popup.create({
  el: '#register-popup',
  closeByBackdropClick: true,
  backdrop: true
});

// Open/Close popup
document.getElementById("open-login").addEventListener("click", e => {
  e.preventDefault();
  loginPopup.open();
});
document.getElementById("open-register").addEventListener("click", e => {
  e.preventDefault();
  loginPopup.close();
  registerPopup.open();
});
document.getElementById("back-to-login").addEventListener("click", e => {
  e.preventDefault();
  registerPopup.close();
  loginPopup.open();
});

// ==========================
// Authentication
// ==========================
document.getElementById("register-form-auth").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("reg-email").value;
  const pass = document.getElementById("reg-password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    app7.dialog.alert("✅ Account created!");
    registerPopup.close();
  } catch (err) { 
    app7.dialog.alert("⚠️ Error: " + err.message); 
  }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    app7.dialog.alert("✅ Login success!");
    loginPopup.close();
  } catch (err) { 
    app7.dialog.alert("⚠️ Login error: " + err.message); 
  }
});

document.getElementById("google-login").addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    app7.dialog.alert("✅ Login success!");
    loginPopup.close();
  } catch (err) { 
    app7.dialog.alert("⚠️ Google login error: " + err.message); 
  }
});

// Show/Hide Login-Logout button
const logoutBtn = document.getElementById("logout-btn");
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("open-login").style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    document.getElementById("open-login").style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
logoutBtn.addEventListener("click", () => signOut(auth));

// ==========================
// Live Chat (Firestore)
// ==========================
  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const typingPreview = document.getElementById("typing-preview");

  let currentUser = "me";

  // Update preview saat ngetik
  chatInput.addEventListener("input", () => {
    typingPreview.textContent = chatInput.value
      ? "You are typing: " + chatInput.value
      : "";
  });

  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text === "") return;

    // Buat div pesan
    const div = document.createElement("div");
    div.className = "chat-message " + currentUser;
    div.textContent = (currentUser === "me" ? "You" : "Other") + ": " + text;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = "";
    typingPreview.textContent = ""; // reset preview

    // Simulasi balasan
    if (currentUser === "me") {
      setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "chat-message other";
        reply.textContent = "Miki: Aight → " + text;
        chatBox.appendChild(reply);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1000);
    }
  });


// ==========================
// Registration Form → Firestore
// ==========================
document.querySelector("#register form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    fullname: form.fullname.value,
    email: form.email.value,
    company: form.company.value,
    role: form.role.value,
    track: form.track.value,
    notes: form.notes.value,
    date: form.date.value,
    plan: form.plan.value,
    createdAt: serverTimestamp()
  };
  await addDoc(collection(db, "registrations"), data);
  app7.dialog.alert("✅ Registration submitted!");
  form.reset();
});

document.querySelector(".to-bottom").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
  });