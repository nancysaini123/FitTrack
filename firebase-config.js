// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyB4tMLJlJXDsVFO6x9qUpc_rnyaoM3qVVM",
  authDomain: "fittrack-12307.firebaseapp.com",
  projectId: "fittrack-12307",
  storageBucket: "fittrack-12307.firebasestorage.app",
  messagingSenderId: "890215091003",
  appId: "1:890215091003:web:e0036297641372332ec51e",
  measurementId: "G-5BNKXPBCBV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);