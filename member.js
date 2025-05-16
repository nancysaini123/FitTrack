// member.js
import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
const billCollection = collection(db, 'bills');
const notificationCollection = collection(db, 'notifications');
const dietCollection = collection(db, 'diets');
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userEmail = user.email;
    // Load bills
    const billsQuery = query(billCollection, where('memberEmail', '==', userEmail));
    const billSnapshot = await getDocs(billsQuery);
    const billsTbody = document.getElementById('memberBills');
    billSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = `<tr>
        <td>${data.amount}</td>
        <td>${data.dueDate}</td>
      </tr>`;
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
  } else {
    window.location.href = '../pages/login.html';
  }
});