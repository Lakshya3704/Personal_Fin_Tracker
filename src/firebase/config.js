
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDA83FYIJXydjCF4ws8tgiR0dbK8A_drjA",
    authDomain: "personal-fin-tracker-a8e6d.firebaseapp.com",
    databaseURL: "https://personal-fin-tracker-a8e6d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "personal-fin-tracker-a8e6d",
    storageBucket: "personal-fin-tracker-a8e6d.firebasestorage.app",
    messagingSenderId: "377557422287",
    appId: "1:377557422287:web:00392c673e114d5bbf27ba",
    measurementId: "G-THQ6NSQ3VR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); 
export { auth, db, rtdb };