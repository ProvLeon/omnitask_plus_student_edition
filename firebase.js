// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoyzTifpsNCEP8PJwU0WXg2AiVX3rELeg",
  authDomain: "omnitask-plus-student-edition.firebaseapp.com",
  projectId: "omnitask-plus-student-edition",
  storageBucket: "omnitask-plus-student-edition.appspot.com",
  messagingSenderId: "1066266883883",
  appId: "1:1066266883883:web:926492f65ee61b9437f76e",
  measurementId: "G-80MS96SCWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
