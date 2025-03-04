import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD296EUwe-YfSp-4bW3Pz2TbYhy-4-H8VU",
  authDomain: "diyetisyen-3809c.firebaseapp.com",
  projectId: "diyetisyen-3809c",
  storageBucket: "diyetisyen-3809c.firebasestorage.app",
  messagingSenderId: "401795538751",
  appId: "1:401795538751:web:8b3658eee784e2fbae7d8a",
  measurementId: "G-PZHLE60HVQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export { db, storage, analytics, app }; 