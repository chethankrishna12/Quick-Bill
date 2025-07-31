import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD...", // your actual keys
  authDomain: "quickbill-7aa97.firebaseapp.com",
  projectId: "quickbill-7aa97",
  storageBucket: "quickbill-7aa97.appspot.com",
  messagingSenderId: "936947412348",
  appId: "1:936947412348:web:ec325869f3e9be9b6648f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
