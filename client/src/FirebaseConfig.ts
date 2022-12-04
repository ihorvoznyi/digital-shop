import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDIGmWiFFWmWeOUG0hUlhyFgqmlla6LgAU',
  authDomain: 'digital-shop-97cb2.firebaseapp.com',
  projectId: 'digital-shop-97cb2',
  storageBucket: 'digital-shop-97cb2.appspot.com',
  messagingSenderId: '940974159813',
  appId: '1:940974159813:web:371fbf7030a46bff70bdac',
  measurementId: 'G-2HS2SF024S'
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);