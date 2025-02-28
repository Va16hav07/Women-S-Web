import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRQVsWQ3eUzmHvR73YkgRHGKfwvbDjSuw",
  authDomain: "safeguardian-aa73a.firebaseapp.com",
  projectId: "safeguardian-aa73a",
  storageBucket: "safeguardian-aa73a.appspot.com", // Corrected this line
  messagingSenderId: "1091231904449",
  appId: "1:1091231904449:web:c66bf529202d9c03165a40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;