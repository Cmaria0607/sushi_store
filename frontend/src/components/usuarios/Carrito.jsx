import React, { useState, useMemo, useEffect } from 'react';
import FormularioPedido from './FormularioPedido';

const Carrito = ({
  carrito,
  eliminarDelCarrito,
  setMostrarCarrito,
  aumentarCantidad,
  disminuirCantidad,
  setCarrito, // <-- Necesario para vaciar el carrito
}) => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + (item.precio_venta ?? item.precio) * item.cantidad, 0),
    [carrito]
  );

  const volverAlMenu = () => {
    if (setMostrarCarrito) setMostrarCarrito(false);
  };

  const vaciarCarrito = () => {
    setCarrito([]); // Vacía el carrito
  };
  const cerrarFormulario = () => {
  setMostrarFormulario(false); // Cambia el estado
};


  // Detectar cierre del formulario para hacer scroll
  useEffect(() => {
    if (!mostrarFormulario) {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        setTimeout(() => {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
      }
    }
  }, [mostrarFormulario]);

  return (
    <aside className="fixed right-0 top-0 w-full max-w-sm h-full bg-white shadow-lg z-50 overflow-y-auto p-6 text-black">
      {mostrarFormulario ? (
        <FormularioPedido
          carrito={carrito}
          onClose={cerrarFormulario}
          vaciarCarrito={vaciarCarrito} // <-- Se pasa la función
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center">Carrito vacío</p>
              <button
                onClick={volverAlMenu}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Volver al menú
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y">
                {carrito.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{item.nombre}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className="text-xl px-2 text-gray-700 hover:text-orange-500"
                          onClick={() => disminuirCantidad(item.id)}
                        >
                          -
                        </button>
                        <span className="font-bold">{item.cantidad}</span>
                        <button
                          className="text-xl px-2 text-gray-700 hover:text-orange-500"
                          onClick={() => aumentarCantidad(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        ${(item.precio_venta ?? item.precio)} c/u = ${((item.precio_venta ?? item.precio) * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 text-xl"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col items-end gap-2">
                <p className="text-xl font-bold mb-2">Total: ${total.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={volverAlMenu}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition"
                  >
                    Volver al menú
                  </button>
                  <button
                    onClick={() => setMostrarFormulario(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Pedir
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
};

export default Carrito;
