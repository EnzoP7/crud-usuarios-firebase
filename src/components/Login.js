import React, { useState } from "react";
import app from "../Credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(app);

const Login = () => {
  const [registro, setRegistro] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if (registro) {
      await createUserWithEmailAndPassword(auth, correo, contraseña);
    } else {
      await signInWithEmailAndPassword(auth, correo, contraseña);
    }
  };
  return (
    <div className="container mx-auto text-center">
      <div className="my-5 pb-5 bg-slate-500/75 rounded-xl">
        <h1 className="my-10 text-6xl">
          {registro ? "Registrate" : "Iniciar Sesion"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 px-5">
            <label className="px-5">Email Adress</label>
            <input
              className="rounded-md p-3"
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              required
            />
          </div>
          <div className="mb-3 ">
            <label className="px-5">Contraseña:</label>
            <input
              className="rounded-md p-3"
              type="password"
              name="password"
              placeholder="password"
              id="password"
              required
            />
          </div>

          <button type="submit" className="btn bg-cyan-400 mb-5">
            {registro ? "Registrate" : "Iniciar Sesion"}
          </button>
        </form>

        <div>
          <button
            className="btn bg-orange-500"
            onClick={() => {
              setRegistro(!registro);
            }}
          >
            {registro
              ? "ya tienes una cuenta? Inicia Sesion"
              : "No tienes una cuenta? Registrate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
