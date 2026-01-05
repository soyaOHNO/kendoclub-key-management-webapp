// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyARH9hhxZ1U69WwMx3WepXLi5jZRsdpEAM",
  authDomain: "key-manager-be58d.firebaseapp.com",
  projectId: "key-manager-be58d",
  storageBucket: "key-manager-be58d.firebasestorage.app",
  messagingSenderId: "668514392086",
  appId: "1:668514392086:web:981c5d1dc8b8c748f43d37",
  measurementId: "G-8562Q3M4QS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
