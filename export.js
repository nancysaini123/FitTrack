// export.js

import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
const memberCollection = collection(db, 'members');
document.getElementById('exportBtn').addEventListener('click', async () => {
  try {
    const querySnapshot = await getDocs(memberCollection);
    const members = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      members.push({
        Name: data.name || '',
        Email: data.email || '',
        Phone: data.phone || '',
        Plan: data.plan || '',
        Type: data.type || ''
      });
    });
    if (members.length === 0) {
      alert('No data found to export.');
      return;
    }
    const headers = Object.keys(members[0]).join(',') + '\n';
    const rows = members.map(obj => Object.values(obj).join(',')).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gym_members_report.csv';
    a.click();
  } catch (error) {
    console.error('Export error:', error);
    alert('Failed to export member data.');
  }
});