import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBV9BCEEDKP5uTQXzBhbyS0WOU1pohrtjQ",
  authDomain: "kneerevive-2a27b.firebaseapp.com",
  projectId: "kneerevive-2a27b",
  storageBucket: "kneerevive-2a27b.firebasestorage.app",
  messagingSenderId: "180793081260",
  appId: "1:180793081260:web:4cb203d715486b7254ce09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }