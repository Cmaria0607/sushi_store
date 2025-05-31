import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CONTRASENA_ADMIN = "admin123"; // Cambia por una segura

const LoginAdmin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CONTRASENA_ADMIN) {
      localStorage.setItem("authAdmin", "true"); // Guardar sesión simulada
      navigate("/admin");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-4">Acceso Administrador</h2>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
