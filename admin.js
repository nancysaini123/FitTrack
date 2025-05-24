// admin.js with Pagination + Sorting + Firestore Ops
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Collections
const memberCollection = collection(db, 'members');
const dietCollection = collection(db, 'diets');
const billCollection = collection(db, 'bills');
const notificationCollection = collection(db, 'notifications');

// Global variables
let allMembers = [];
let currentPage = 1;
const itemsPerPage = 5;
let currentFilter = '';
let currentSort = 'name';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const paginationContainer = document.getElementById('pagination');
const membersBody = document.getElementById('membersBody'); // Your <tbody>

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

// Fetch members from Firestore
async function fetchMembers() {
  const snapshot = await getDocs(memberCollection);
  allMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderMembers();
}

// Render members with filter, sort, pagination
function renderMembers() {
  if (!membersBody) return;
  membersBody.innerHTML = '';

  let filtered = allMembers.filter(m => m.name?.toLowerCase().includes(currentFilter));
  filtered.sort((a, b) => (a[currentSort] || '').localeCompare(b[currentSort] || ''));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pagedMembers = filtered.slice(start, end);

  pagedMembers.forEach(member => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input class="edit-name" data-id="${member.id}" value="${member.name}" /></td>
      <td><input class="edit-phone" data-id="${member.id}" value="${member.phone}" /></td>
      <td><input class="edit-plan" data-id="${member.id}" value="${member.plan}" /></td>
      <td><input class="edit-type" data-id="${member.id}" value="${member.type}" /></td>
      <td>
        <button onclick="updateMember('${member.id}')">Update</button>
        <button onclick="deleteMember('${member.id}')">Delete</button>
      </td>
    `;
    membersBody.appendChild(row);
  });

  // Render pagination
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

// Save Diet Plan
const dietForm = document.getElementById('dietForm');
if (dietForm) {
  dietForm.addEventListener('submit', async (e) => {
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
      dietForm.reset();
    } catch (error) {
      console.error('Error saving diet plan:', error);
      dietMessage.textContent = '❌ Failed to save diet plan.';
      dietMessage.style.color = 'red';
    }
  });
}

// Create Bill
const createBillForm = document.getElementById('createBillForm');
if (createBillForm) {
  createBillForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberEmail = document.getElementById('memberEmail').value;
    const amount = document.getElementById('amount').value;
    const dueDate = document.getElementById('dueDate').value;
    try {
      await addDoc(billCollection, { memberEmail, amount, dueDate });
      document.getElementById('billMessage').textContent = 'Bill created successfully!';
      createBillForm.reset();
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  });
}

// Send Notification
const sendNotificationForm = document.getElementById('sendNotificationForm');
if (sendNotificationForm) {
  sendNotificationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;
    try {
      await addDoc(notificationCollection, {
        message,
        date: new Date().toISOString()
      });
      document.getElementById('notificationMessage').textContent = 'Notification sent successfully!';
      sendNotificationForm.reset();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  });
}
