// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHNOFleWLrNp2_308OekeRJCSNV3z5Gdg",
  authDomain: "tsushimakendo-key-management.firebaseapp.com",
  projectId: "tsushimakendo-key-management",
  storageBucket: "tsushimakendo-key-management.firebasestorage.app",
  messagingSenderId: "231389675503",
  appId: "1:231389675503:web:b72e6432a409eb0e05001a",
  measurementId: "G-MZFZ50P99R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
