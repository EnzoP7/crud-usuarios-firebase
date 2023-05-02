import React, { useEffect, useState } from "react";
import app from "../Credenciales";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../Credenciales";

//! agregamos a una constante estos 2 paquetes
const auth = getAuth(app);
const db = getFirestore(app);

//! Recibimos el correo del usuario para poder decirle: "PIBE BIENVENIDO"
const Home = ({ correoUsuario }) => {
  //! Declaramos un estado Inicial
  const valorInicial = {
    nombre: "",
    edad: "",
    profesion: "",
    imagen: "",
  };

  const [user, setUser] = useState(valorInicial);
  //! En este estado, se va a guardar toda la lista de Usuarios
  const [lista, setLista] = useState([]);
  //! Este estado es para poder detectar si se quiere editar o no
  const [subID, setSubID] = useState("");
  //! este estado es para obtener la url de la imagen
  const [file, setfile] = useState(null);

  const capturarImputs = (e) => {
    const { name, value } = e.target;
    //! seteamos el user con lo que ya tiene + para cada nombre su valor
    setUser({ ...user, [name]: value });
  };

  //! funcionalidad para actualizar o guardar los datos

  const guardarDatos = async (e) => {
    e.preventDefault();
    // console.log(user);

    //! Si el Archivo existe entonces lo subimos y lo descargamos , y asignamos su url a la imagen
    if (file) {
      const storageRef = ref(storage, v4());
      await uploadBytes(storageRef, file);
      user.imagen = await getDownloadURL(storageRef);
    }

    //! Aqui estamos identificando si se esta editando o se esta creando uno nuevo
    //! si el SubID es vacio es xq no se seteo al dar actualizar por ende no es de actualizacion
    if (subID === "") {
      try {
        //! Agregamos un documento , la cual es una colleccion que se encuentra en la db y tiene el nombre usuarios, pero ademas de esto tambien le enviamos la copia de users
        await addDoc(collection(db, "usuarios"), {
          ...user,
        });

        alert("Usuario Ingresado Correctamente");
      } catch (error) {
        console.log(error);
      }
    } else {
      //! En caso de que sea un numero entonces seteamos el documento de nuestra db, en la collecion usuarios y mandamos el id, y ademas de esto le mandamos la copia de la variable de estado
      await setDoc(doc(db, "usuarios", subID), {
        ...user,
      });
      alert("Usuario Actualizado Correctamente");
    }
    //!seteamos a vacio y tambien le decimos al subId que tambien sea vacio sino siempre va a ser actualizar la cuestion
    setUser({ ...valorInicial });
    setSubID("");
  };

  //! Realizamos un useEffect para cargar la lista
  useEffect(() => {
    const getLista = async () => {
      try {
        //! creamos constante para guardar todos los docs de la coleccion de usuarios
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        //! creamos constante para guardarlos
        const docs = [];
        //! doc es una funcionalidad de firebase que nos permite acceder a los datos de un documento
        //! ahora por cada documento vamos a mandarlo a docs, y vamos a mandar la data de ese documento asignando como Id el id del Doc que se esta enviando
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });

        //! Seteamos la lista con lo que hay en docs
        setLista(docs);
      } catch (error) {
        console.log(error);
      }
    };
    //!Llamamos a la funcion sino no funca xd
    getLista();

    //! se usa esta funcion cada vez que cambie la lista
  }, [lista]);

  //! Funcion para eliminar usuario, le mandamos el documento de la base de datos con la coleccion llamada usuarios y le mandamos el ID que tiene que eliminar, esta funcion funciona cuando damos click en eliminar ya que se manda el lista.id ya que se le hace un .map (Mirar boton eliminar)
  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "usuarios", id));
    alert("Usuario Eliminado Correctamente");
  };

  //! Esta funcion es para poder Obtener la info de los usuarios
  const getOne = async (id) => {
    try {
      //!  creamos constante que se le asigna el documento de la base de datos de la coleccion usuarios con el id que se recibe
      const docRef = doc(db, "usuarios", id);
      //! Creamos otra constante la cual recibe ese tal documento
      const docSnap = await getDoc(docRef);

      //! ACA seteamos los campos con la data que tiene el docSnap asi se rellenan los campos solos
      setUser(docSnap.data());
    } catch (error) {
      console.log(console.error());
    }
  };

  //! useEffect para que si se llega a seleccionar alguno en actualizar (porque setearia el subId y dejaria de ser "") se llama a la funcion getOne mandandole el subId que viene a ser el Id del Usuario seleccionado
  useEffect(() => {
    if (subID !== "") {
      getOne(subID);
    }
    //! Se llama a esta funcion cada vez que se cambia el subId
  }, [subID]);

  return (
    <div className="container mx-auto text-center">
      <p className="my-5 mx-5">
        Bienvenido, <strong>{correoUsuario}</strong> Haz Iniciado Sesion, te Amo
        bb
      </p>

      <button
        className="btn bg-red-700 mx-5 mb-4"
        //! SE LLAMA A FUNCION PARA DESLOGEAR
        onClick={() => signOut(auth)}
      >
        Cerrar Sesion
      </button>

      <hr />

      <div className="grid  grid-cols-1  sm:grid-cols-2">
        <div>
          <h3>Ingresar Usuario</h3>
          <form onSubmit={guardarDatos}>
            <div className="card card-body">
              <div className="form-control">
                <input
                  type="text"
                  name="nombre"
                  className="form-control p-5 my-3 rounded-lg bg-slate-300 placeholder-black"
                  id="nombre"
                  placeholder="Ingresar el nombre del Usuario"
                  onChange={capturarImputs}
                  value={user.nombre}
                />
                <input
                  type="text"
                  name="edad"
                  className="form-control my-3 p-5 rounded-lg bg-slate-300 placeholder-black"
                  id="edad"
                  placeholder="Ingresar edad del Usuario"
                  onChange={capturarImputs}
                  value={user.edad}
                />
                <input
                  type="text"
                  name="profesion"
                  className="form-control my-3 p-5 rounded-lg bg-slate-300 placeholder-black"
                  id="profesion"
                  placeholder="Ingresar la profesion del Usuario"
                  onChange={capturarImputs}
                  value={user.profesion}
                />

                <input
                  type="file"
                  name="imagen"
                  className="file-input file-input-bordered file-input-info w-full max-w-xs"
                  onChange={async (e) => {
                    setfile(e.target.files[0]);
                    // const result = await uploadFile(file);

                    // console.log(result);
                  }}
                />
              </div>

              <button className="btn bg-cyan-400">
                {subID === "" ? "Guardar" : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2>Lista De Usuarios</h2>
          <div className="container card">
            <div className="card-body">
              {lista.map((list) => (
                <div key={list.id}>
                  <img src={list.imagen} alt="IMAGEN" />
                  <p>Nombre: {list.nombre}</p>
                  <p>Edad: {list.edad}</p>
                  <p>Profesion: {list.profesion}</p>

                  <button
                    className="btn bg-red-700"
                    //! Se llama a la funcion eliminar y se le manda el id de este usuario
                    onClick={() => deleteUser(list.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn bg-green-500 m-3"
                    //!  a diferencia del de arriba, en este caso seteamos el subId con el id del usuario por ende el useEffect que hicimos llamara a el getOne
                    onClick={() => setSubID(list.id)}
                  >
                    Actualizar
                  </button>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
