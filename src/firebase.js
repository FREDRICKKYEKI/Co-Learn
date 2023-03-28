import { initializeApp } from "firebase/app";
import  {getAuth, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth"
import 'firebase/compat/firestore'
import { getStorage } from 'firebase/storage'
import { getFirestore as getFirestorelite, doc } from 'firebase/firestore/lite';
import { getFirestore, collection, doc as dOc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMnmAHLfCg14rP2Y2fWMJzPh5icGSX6UA",
  authDomain: "topcoderchallenge.firebaseapp.com",
  projectId: "topcoderchallenge",
  storageBucket: "topcoderchallenge.appspot.com",
  messagingSenderId: "400531289042",
  appId: "1:400531289042:web:9e7bf4c22adf9b02578e0b",
  measurementId: "G-E9K7WFQ37B"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestorelite(app)
export const db2 = getFirestore(app)
export const storage = getStorage(app)
export const gProvider = new GoogleAuthProvider();
export const fProvider = new FacebookAuthProvider();
export const auth = getAuth(app)

export const database = 
{ 
  user: (id) => doc(db, 'users', id),
  learningSpace: (id) => doc(db, 'learning_spaces', id),
  vote: (id) => dOc(db2, 'votes', id),
  post: (id) => dOc(db2, 'posts', id),
  formatDoc: doc => {return {id: doc.id, ...doc.data()}},
  learningSpaces: collection(db2, 'learning_spaces'),
  users: collection(db2, 'users'),
  posts: collection(db2, 'posts'),
  votes: collection(db2, 'votes'),
  comments: collection(db2, 'commemts')
}