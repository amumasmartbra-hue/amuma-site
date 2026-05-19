import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD64VYlS0XfLKsnWosIrrK9wuUziIDheuc",
  authDomain: "amuma-data.firebaseapp.com",
  databaseURL: "https://amuma-data-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "amuma-data",
  storageBucket: "amuma-data.firebasestorage.app",
  messagingSenderId: "658437710046",
  appId: "1:658437710046:web:29796eac964189dce5a24f",
  measurementId: "G-B21B0WDY16"
};

const app = initializeApp(firebaseConfig)

const db = getDatabase(app)
const auth = getAuth(app)

export { app, db, auth }