import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDoacgXDxP7KwN-xZGdrmQgXoWyOzhQaRc",
    authDomain: "slack-clone-f1aa0.firebaseapp.com",
    projectId: "slack-clone-f1aa0",
    storageBucket: "slack-clone-f1aa0.appspot.com",
    messagingSenderId: "2272831608",
    appId: "1:2272831608:web:315eebe371b4e3c863658d",
    measurementId: "G-NEE9R8H3WY"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);