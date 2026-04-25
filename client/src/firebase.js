import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC75jEJKDnvqeWmBlOFojOnwjSmxwqKJAM",
  authDomain: "amuma-smart-bra-data.firebaseapp.com",
  databaseURL: "https://amuma-smart-bra-data-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "amuma-smart-bra-data",
  storageBucket: "amuma-smart-bra-data.firebasestorage.app",
  messagingSenderId: "631805517116",
  appId: "1:631805517116:web:a9c20b01d58538ce719239",
  measurementId: "G-HCGNHSL86D"
};

const app = initializeApp(firebaseConfig)

const db = getDatabase(app)
const auth = getAuth(app)

export { app, db, auth }