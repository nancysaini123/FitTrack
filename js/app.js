import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const db = getFirestore();

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Step 1: Look for user in Firestore 'members' collection
      const q = query(collection(db, "members"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userType = userData.type;

        // Step 2: Redirect based on user type
        if (userType === 'admin') {
          window.location.href = 'admin.html';
        } else if (userType === 'member') {
          window.location.href = 'member.html';
        } else if (userType === 'user') {
          window.location.href = 'user.html';
        } else {
          document.getElementById('loginError').textContent = 'Unknown user type.';
        }
      } else {
        document.getElementById('loginError').textContent = 'User data not found in database.';
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('loginError').textContent = errorMessage;
      console.error('Login error:', errorMessage);
    });
});
