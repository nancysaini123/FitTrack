// admin.js with Pagination + Sorting
import { db } from './firebase-config.js';
import { collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
const memberCollection = collection(db, 'members');
let allMembers = [];
let currentPage = 1;
const itemsPerPage = 5;
let currentFilter = '';
let currentSort = 'name';
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const paginationContainer = document.getElementById('pagination');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    currentFilter = searchInput.value.trim().toLowerCase();
    renderMembers();
  });
}
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    renderMembers();
  });
}
// Fetch all members once
async function fetchMembers() {
  const querySnapshot = await getDocs(memberCollection);
  allMembers = [];
  querySnapshot.forEach((docSnap) => {
    allMembers.push({ id: docSnap.id, ...docSnap.data() });
  });
  renderMembers();
}
function renderMembers() {
  const tbody = document.getElementById('memberTableBody');
  tbody.innerHTML = '';
  // Filter and sort
  let filtered = allMembers.filter(m =>
    m.name.toLowerCase().includes(currentFilter) ||
    m.email.toLowerCase().includes(currentFilter) ||
    m.phone.toLowerCase().includes(currentFilter)
  );
  filtered.sort((a, b) => a[currentSort].localeCompare(b[currentSort]));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const pageMembers = filtered.slice(start, start + itemsPerPage);
  pageMembers.forEach(data => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" value="${data.name}" data-id="${data.id}" class="edit-name"/></td>
      <td><input type="email" value="${data.email}" data-id="${data.id}" class="edit-email" disabled/></td>
      <td><input type="text" value="${data.phone}" data-id="${data.id}" class="edit-phone"/></td>
      <td>
        <select class="edit-plan" data-id="${data.id}">
          <option value="monthly" ${data.plan === 'monthly' ? 'selected' : ''}>Monthly</option>
          <option value="quarterly" ${data.plan === 'quarterly' ? 'selected' : ''}>Quarterly</option>
          <option value="yearly" ${data.plan === 'yearly' ? 'selected' : ''}>Yearly</option>
        </select>
      </td>
      <td>
        <select class="edit-type" data-id="${data.id}">
          <option value="admin" ${data.type === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="member" ${data.type === 'member' ? 'selected' : ''}>Member</option>
          <option value="user" ${data.type === 'user' ? 'selected' : ''}>User</option>
        </select>
      </td>
      <td>
        <button onclick="updateMember('${data.id}')">Update</button>
        <button onclick="deleteMember('${data.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  // Pagination controls
  paginationContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderMembers();
    });
    paginationContainer.appendChild(btn);
  }
}
fetchMembers();
// Update Member
window.updateMember = async function (id) {
  const name = document.querySelector(`.edit-name[data-id='${id}']`).value;
  const phone = document.querySelector(`.edit-phone[data-id='${id}']`).value;
  const plan = document.querySelector(`.edit-plan[data-id='${id}']`).value;
  const type = document.querySelector(`.edit-type[data-id='${id}']`).value;
  try {
    const memberRef = doc(db, 'members', id);
    await updateDoc(memberRef, { name, phone, plan, type });
    alert('Member updated successfully!');
  } catch (error) {
    console.error('Error updating member:', error);
    alert('Failed to update member.');
  }
};
// Delete Member
window.deleteMember = async function (id) {
  if (confirm('Are you sure you want to delete this member?')) {
    await deleteDoc(doc(db, 'members', id));
    alert('Member deleted successfully');
    location.reload();
  }
};
// Assign Package
if (document.getElementById('assignPackageForm')) {
  document.getElementById('assignPackageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const plan = document.getElementById('plan').value;
    const messageBox = document.getElementById('packageMessage');
    try {
      const q = query(memberCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const memberDoc = querySnapshot.docs[0];
        const memberRef = doc(db, 'members', memberDoc.id);
        await updateDoc(memberRef, { plan });
        messageBox.textContent = `✅ Package '${plan}' assigned to ${email}`;
        messageBox.style.color = 'green';
        document.getElementById('assignPackageForm').reset();
      } else {
        messageBox.textContent = '❌ Member not found.';
        messageBox.style.color = 'red';
      }
    } catch (error) {
      console.error('Error assigning package:', error);
      messageBox.textContent = '❌ Error assigning package.';
      messageBox.style.color = 'red';
    }
  });
}
// Save Diet Plan
if (document.getElementById('dietForm')) {
  document.getElementById('dietForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const goal = document.getElementById('goal').value;
    const diet = document.getElementById('diet').value;
    const dietMessage = document.getElementById('dietMessage');
    try {
      await addDoc(dietCollection, {
        email,
        goal,
        diet,
        createdAt: new Date().toISOString()
      });
      dietMessage.textContent = '✅ Diet plan saved successfully!';
      dietMessage.style.color = 'green';
      document.getElementById('dietForm').reset();
    } catch (error) {
      console.error('Error saving diet plan:', error);
      dietMessage.textContent = '❌ Failed to save diet plan.';
      dietMessage.style.color = 'red';
    }
  });
}
// Create Bill
if (document.getElementById('createBillForm')) {
  document.getElementById('createBillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberEmail = document.getElementById('memberEmail').value;
    const amount = document.getElementById('amount').value;
    const dueDate = document.getElementById('dueDate').value;
    try {
      await addDoc(billCollection, {
        memberEmail,
        amount,
        dueDate
      });
      document.getElementById('billMessage').textContent = 'Bill created successfully!';
      document.getElementById('createBillForm').reset();
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  });
}
// Send Notification
if (document.getElementById('sendNotificationForm')) {
  document.getElementById('sendNotificationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;
    try {
      await addDoc(notificationCollection, {
        message,
        date: new Date().toISOString()
      });
      document.getElementById('notificationMessage').textContent = 'Notification sent successfully!';
      document.getElementById('sendNotificationForm').reset();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });
}