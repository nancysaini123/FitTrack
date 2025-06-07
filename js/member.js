// member.js
import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const billCollection = collection(db, 'bills');
const notificationCollection = collection(db, 'notifications');
const dietCollection = collection(db, 'diets');
const userCollection = collection(db, 'users');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userEmail = user.email;

    try {
      // Load profile info
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const profile = userDocSnap.data();
        document.getElementById('memberName').textContent = profile.name || 'N/A';
        document.getElementById('memberEmail').textContent = profile.email || 'N/A';
        document.getElementById('memberPlan').textContent = profile.plan || 'Standard';
        document.getElementById('joinDate').textContent = profile.joinDate || 'N/A';
      }

      // Load bills
      const billsQuery = query(billCollection, where('memberEmail', '==', userEmail));
      const billSnapshot = await getDocs(billsQuery);
      const billsTbody = document.getElementById('memberBills');
      billSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = `<tr><td>${data.amount}</td><td>${data.dueDate}</td></tr>`;
        billsTbody.innerHTML += row;
      });

      // Load notifications
      const notificationSnapshot = await getDocs(notificationCollection);
      const notificationUl = document.getElementById('memberNotifications');
      notificationSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const listItem = `<li>${data.message} (Sent on: ${new Date(data.date).toLocaleDateString()})</li>`;
        notificationUl.innerHTML += listItem;
      });

      // Load diet plans
      const dietQuery = query(dietCollection, where('email', '==', userEmail));
      const dietSnapshot = await getDocs(dietQuery);
      const dietList = document.getElementById('memberDiets');
      dietSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const item = `<li><strong>${data.goal.replace('_', ' ')}:</strong> ${data.diet}</li>`;
        dietList.innerHTML += item;
      });

    } catch (err) {
      console.error('Error loading member data:', err);
    }
  } else {
    window.location.href = '../pages/index.html';
  }
});
