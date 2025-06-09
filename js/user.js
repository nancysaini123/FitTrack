import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const memberCollection = collection(db, 'members');

// Search Member
if (document.getElementById('searchForm')) {
  document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchEmail = document.getElementById('searchInput').value;
    const searchResultDiv = document.getElementById('searchResult');
    searchResultDiv.innerHTML = '';

    const q = query(memberCollection, where('email', '==', searchEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      searchResultDiv.innerHTML = '<p>No member found.</p>';
    } else {
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        searchResultDiv.innerHTML = `
          <h3>Member Details:</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Plan:</strong> ${data.plan}</p>
        `;
      });
    }
  });
}

// Logout function
function logout() {
  signOut(auth).then(() => {
    window.location.href = '../pages/login.html';
  }).catch((error) => {
    console.error('Logout Error:', error);
  });
}

window.logout = logout;
