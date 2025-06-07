// bill.js - Handles bill creation and saving to Firestore

import { db } from './firebase-config.js';
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Reference to 'bills' collection
const billCollection = collection(db, 'bills');

// Attach submit event if form exists
const billForm = document.getElementById('createBillForm');
if (billForm) {
  billForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const memberEmail = document.getElementById('memberEmail').value;
    const amount = document.getElementById('amount').value;
    const dueDate = document.getElementById('dueDate').value;
    const billMessage = document.getElementById('billMessage');

    try {
      await addDoc(billCollection, {
        memberEmail,
        amount,
        dueDate,
        createdAt: new Date().toISOString()
      });

      billMessage.textContent = '✅ Bill created successfully!';
      billMessage.style.color = 'green';
      billForm.reset();
    } catch (error) {
      console.error('❌ Error creating bill:', error);
      billMessage.textContent = '❌ Failed to create bill.';
      billMessage.style.color = 'red';
    }
  });
}
