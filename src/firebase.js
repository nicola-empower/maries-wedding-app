// src/firebase.js
// This file contains the Firebase configuration and initialization code
// https://firebase.google.com/docs/web/setup#available-libraries
// --- Make sure these import lines are here ---
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5BVuWgBFBqVA9pECLHdXUGt1ES2vepZY",
  authDomain: "maries-wedding-app.firebaseapp.com",
  projectId: "maries-wedding-app",
  storageBucket: "maries-wedding-app.firebasestorage.app",
  messagingSenderId: "45957579216",
  appId: "1:45957579216:web:45fdeb16f16333ff4539d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);