// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3FZMTjtXu78wWyGKKB52rCJUU7GC8_so",
  authDomain: "ridingapp-c7874.firebaseapp.com",
  projectId: "ridingapp-c7874",
  storageBucket: "ridingapp-c7874.firebasestorage.app",
  messagingSenderId: "19743251996",
  appId: "1:19743251996:web:a3f3871fac8085b228c9d9",
  measurementId: "G-N9QQZ2DZFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);