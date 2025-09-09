import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAyqyh-q4XgfXMmxHj8XqgMEv0pRTULoBE",
    authDomain: "reactnative-a9cad.firebaseapp.com",
    projectId: "reactnative-a9cad",
    storageBucket: "reactnative-a9cad.firebasestorage.app",
    messagingSenderId: "317752052373",
    appId: "1:317752052373:web:e41a7a69dd4d1a9e0a299c"
  };

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
