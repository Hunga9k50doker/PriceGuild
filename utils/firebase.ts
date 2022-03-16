import firebase, {initializeApp} from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEhlnNzWpoOow4sgMYvdrFNxu2dYjB70A",
  authDomain: "sports-card-price-guide.firebaseapp.com",
  databaseURL: "https://sports-card-price-guide.firebaseio.com",
  projectId: "sports-card-price-guide",
  storageBucket: "sports-card-price-guide.appspot.com",
  messagingSenderId: "371099373657",
  appId: "1:371099373657:web:c3db080b26e9c1f9f02148"
};

if (!firebase.apps.length) {
    initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export { firestore };

