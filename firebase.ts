// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY5zIAMahfOwfIHW-t2b_dkUsG0lbuwUE",
  authDomain: "contactmanagerapp-aa4b1.firebaseapp.com",
  projectId: "contactmanagerapp-aa4b1",
  storageBucket: "contactmanagerapp-aa4b1.firebasestorage.app",
  messagingSenderId: "255629371226",
  appId: "1:255629371226:web:31178f583eb34f7e7eb563"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
