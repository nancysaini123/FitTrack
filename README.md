# FitTrack – GYM Management System 💪

A web-based GYM management system that allows gym administrators to manage members, billing, diet plans, notifications, and more — built using Firebase and JavaScript.

---

## 🚀 Features

- 🧑‍💼 Admin login & registration
- 🏋️‍♂️ Member login & dashboard
- 💰 Create and view bills
- 🥗 Assign personalized diet plans
- 🔔 Send and view notifications
- 📋 View members with search, sort, pagination
- 🔐 Firebase Authentication & Firestore integration

---

## 📂 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase (Auth + Firestore)
- **Export:** jsPDF (for admin reports)

---

## 🖥️ Project Structure
FitTrack/
├── index.html
├── pages/
│ ├── admin.html
│ ├── member.html
│ ├── view-members.html
│ └── create-bill.html
├── js/
│ ├── firebase-config.js
│ ├── admin.js
│ ├── member.js
│ └── bill.js
├── css/
│ └── style.css
├── images/
│ └── FitTrack.png
└── README.md

---

## 🔧 Firebase Setup

1. Create a Firebase project on [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication → Email/Password
3. Create Firestore DB and setup collections:
   - `users` (with `role` field: `admin` or `member`)
   - `bills`, `diets`, `notifications`

4. Replace your `firebase-config.js` with your Firebase project credentials.

---

## 📋 Firestore Rules (for role-based access)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /bills/{billId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    match /diets/{dietId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    match /notifications/{notifId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == \"admin\";
    }
  }
}
