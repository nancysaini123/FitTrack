// register.js

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { auth } from './firebase-config.js';

const db = getFirestore();

const form = document.getElementById('registerForm');
const messageBox = document.getElementById('registerMessage');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const type = document.getElementById('type').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, "members"), {
      email: user.email,
      type: type,
      name: "",
      phone: "",
      plan: ""
    });

    messageBox.textContent = `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} registered successfully! Redirecting to login...`;
    messageBox.style.color = 'green';

    setTimeout(() => {
      window.location.href = './login.html';
    }, 3000);
  } catch (error) {
    console.error('Registration error:', error);
    messageBox.textContent = '❌ Error: ' + error.message;
    messageBox.style.color = 'red';
  }
});
