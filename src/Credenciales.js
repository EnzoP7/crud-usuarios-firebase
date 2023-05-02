// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyDzo-z7IdpRTeeAdWSc373LxEtDlaUCFyg",
  authDomain: "fir-crud-usuarios-a6159.firebaseapp.com",
  projectId: "fir-crud-usuarios-a6159",
  storageBucket: "fir-crud-usuarios-a6159.appspot.com",
  messagingSenderId: "617170359406",
  appId: "1:617170359406:web:4d9b2da71a2f3e2a30027f",
};

/**
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

// //!Es una funcion que recibe el archivo
// export const uploadFile = async (file) => {
//   //! aca creamos una referencia del Storage, ademas necesita un texto para eso llamamos a la funcion generadora de ID
//   const storageRef = ref(storage, v4());
//   //! Marcamos a que storage se va a mandar y el archvio que recibimos
//   await uploadBytes(storageRef, file);
//   const url = await getDownloadURL(storageRef);
//   return url;
// };

export default app;
