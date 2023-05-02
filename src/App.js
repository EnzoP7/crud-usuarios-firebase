import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import app from "./Credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//! Importamos el paquete de getAuth para obtener sus funcionalidades
//! Importamos el onAuthStateChanged que es para saber si se logeo o se deslogeo
const auth = getAuth(app);

function App() {
  const [usuario, setUsuario] = useState(null);
  //! detectamos si se autentico, si esta true seteamos el usuario con lo que tenemos dentro de nuestra aplicacion, sea logear o deslogear
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase);
    } else {
      setUsuario(null);
    }
  });

  return (
    <div className="">
      //! En caso de que haga login y funcione se le enviara el email del
      //!usuario
      {usuario ? <Home correoUsuario={usuario.email} /> : <Login />}
    </div>
  );
}

export default App;
