import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD63PS06QnlAc_6oi7vgwR8ohwUjOWW9y4",
    authDomain: "react-chat-86fbc.firebaseapp.com",
    projectId: "react-chat-86fbc",
    storageBucket: "react-chat-86fbc.appspot.com",
    messagingSenderId: "844490668943",
    appId: "1:844490668943:web:c92fe9d7b3381296ec29fa"
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);