import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA20W-gOcJYfYPsHOhKcHL7gNxh0QRH9yw",
  authDomain: "letter-c3c6b.firebaseapp.com",
  projectId: "letter-c3c6b",
  storageBucket: "letter-c3c6b.firebasestorage.app",
  messagingSenderId: "965332094860",
  appId: "1:965332094860:web:b1bd08c82f25e4bbcf90a9",
  measurementId: "G-F3KPB8VW4G"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

export default firebaseApp;