import firebase from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { getDatabase } from "@react-native-firebase/database"
import { getMessaging } from "@react-native-firebase/messaging" 
const firebaseConfig = {
    apiKey: "AIzaSyATPyp8DJTnVTcJVWkulWzuQfQKcn_DoBQ",
    authDomain: "endtoendchat-5f93e.firebaseapp.com",
    databaseURL: "https://endtoendchat-5f93e-default-rtdb.firebaseio.com",
    projectId: "endtoendchat-5f93e",
    storageBucket: "endtoendchat-5f93e.appspot.com",
    messagingSenderId: "246352642326",
    appId: "1:246352642326:android:ab6b4055f83daa8251d037",
    measurementId: "G-NNXTMKMB2S"
};
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
export {app}

