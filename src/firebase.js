// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlgiUFxnuGDr4-ppqTUpHTq8eFrXyacNI",
  authDomain: "habit-tracker-2cbd3.firebaseapp.com",
  projectId: "habit-tracker-2cbd3",
  storageBucket: "habit-tracker-2cbd3.appspot.com",
  messagingSenderId: "906295437142",
  appId: "1:906295437142:web:fda7c5ed2bfc7ebcbad8f7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
