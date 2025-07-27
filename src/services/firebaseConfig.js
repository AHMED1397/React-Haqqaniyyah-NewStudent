// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9EkvRgiSXeDnd9vwJ7clP8xsFW1sUjhE",
  authDomain: "haqqaniyyah-leave-mamagment.firebaseapp.com",
  databaseURL:
    "https://haqqaniyyah-leave-mamagment-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "haqqaniyyah-leave-mamagment",
  storageBucket: "haqqaniyyah-leave-mamagment.firebasestorage.app",
  messagingSenderId: "832219121252",
  appId: "1:832219121252:web:89316620eb213db51f4171",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
