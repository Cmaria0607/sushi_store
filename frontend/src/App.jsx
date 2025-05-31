import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./components/usuarios/Home";
import Carrito from "./components/usuarios/Carrito";
import React, { useState } from "react";
import AdminPage from "./pages/adminPage";
import LoginAdmin from "./components/administrador/LoginAdmin";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Funciones para el carrito
  const aumentarCantidad = (id) => {
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const disminuirCantidad = (id) => {
    setCarrito(prevCarrito =>
      prevCarrito
        .map(item =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
  };

  // Usa useLocation para obtener la ruta actual de forma reactiva
  const location = useLocation();

  return (
    <>
      {/* Botón flotante para abrir el carrito solo en la ruta de usuario */}
      {location.pathname === "/" && (
        <button
          onClick={() => setMostrarCarrito(true)}
          className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg z-50"
        >
          🛒
          {carrito.length > 0 && (
            <span className="ml-1 text-sm bg-white text-orange-500 px-2 py-0.5 rounded-full">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      )}

      {/* Carrito visible solo si mostrarCarrito es true y en la ruta de usuario */}
      {mostrarCarrito && location.pathname === "/" && (
        <Carrito
          carrito={carrito}
          setCarrito={setCarrito}
          eliminarDelCarrito={eliminarDelCarrito}
          setMostrarCarrito={setMostrarCarrito}
          aumentarCantidad={aumentarCantidad}
          disminuirCantidad={disminuirCantidad}
        />
      )}

      <Routes>
        {/* Ruta para usuarios */}
        <Route path="/" element={
          <Home
            carrito={carrito}
            setCarrito={setCarrito}
            mostrarCarrito={mostrarCarrito}
            setMostrarCarrito={setMostrarCarrito}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
          />
        } />
        <Route path="/admin-login" element={<LoginAdmin />} />
        {/* Ruta para administrador */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/admin-login"/>} />
      </Routes>
    </>
  );
}

// Cambia el return de BrowserRouter para envolver a App
export default function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}