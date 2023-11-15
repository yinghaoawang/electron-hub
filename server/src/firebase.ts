// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const { FB_API_KEY, FB_AD, FB_PID, FB_SB, FB_MSID, FB_APP_ID, FB_MID } =
  process.env;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: FB_AD,
  projectId: FB_PID,
  storageBucket: FB_SB,
  messagingSenderId: FB_MSID,
  appId: FB_APP_ID,
  measurementId: FB_MID
};

// Initialize Firebase
export const initializeFirebase = () => {
  const firebase = initializeApp(firebaseConfig);
  return { firebase };
};
