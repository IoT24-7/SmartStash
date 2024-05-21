// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyD3qNpR_UAi5sXHIX4Way38C-uELvnxkdk',
	authDomain: 'cs145-smartstash.firebaseapp.com',
	databaseURL: 'https://cs145-smartstash-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'cs145-smartstash',
	storageBucket: 'cs145-smartstash.appspot.com',
	messagingSenderId: '985579041843',
	appId: '1:985579041843:web:82d802b451827653e99f46',
	measurementId: 'G-3HQ89HFLNS'
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
