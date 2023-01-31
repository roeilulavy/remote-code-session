import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjV5zJRRdtv7xt_jl61DrdXaozcg5vVKE",
  authDomain: "moveo-code-app.firebaseapp.com",
  projectId: "moveo-code-app",
  storageBucket: "moveo-code-app.appspot.com",
  messagingSenderId: "1040849660284",
  appId: "1:1040849660284:web:638793870e55d37ed15cf9",
  measurementId: "G-YZ4TG73QRW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const fetchCodes = async () => {
  let response = null;

  await getDocs(collection(db, "Codes")).then((querySnapshot) => {
    const codeList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    response = codeList;
  });

  return response;
};

export const getCode = async (codeId) => {
  let response = null;

  await getDocs(collection(db, "Codes")).then((querySnapshot) => {
    const codeBlock = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const matchCode = codeBlock.find((code) => {
      if (code.id === codeId) {
        return code;
      }
      return null;
    });

    response = matchCode.code;
  });

  return response;
};
