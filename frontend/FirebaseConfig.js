import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyApdbStNWwYgH-E_jVkFZJjgVMfWP3kMDk",
    authDomain: "finance-advisor-b7614.firebaseapp.com",
    projectId: "finance-advisor-b7614",
    storageBucket: "finance-advisor-b7614.firebasestorage.app",
    messagingSenderId: "630570235783",
    appId: "1:630570235783:web:1a08c2ae904dd85e944522",
    measurementId: "G-RD029FQZD4"
  };

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
// });
const auth = getAuth(app)

export { app, auth };
