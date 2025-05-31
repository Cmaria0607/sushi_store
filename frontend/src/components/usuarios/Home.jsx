import React, { useEffect, useState } from 'react';
import ProductoCard from './ProductoCard';
import FormularioPedido from './FormularioPedido';

const Home = ({
  carrito,
  setCarrito,
  setMostrarCarrito,

}) => {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al cargar productos:', error));
  }, []);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const existe = prevCarrito.find(p => p.id === producto.id);
      if (existe) {
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
    setMostrarCarrito(true);
  };

  // Total del carrito (opcional, para FormularioPedido)
  const total = carrito.reduce((acc, item) => acc + (item.precio_venta ?? item.precio) * item.cantidad, 0);

  return (
    <div className="relative bg-gray-800 font-sans text-white scroll-smooth">
      {/* HEADER */}
      <header className="shadow-lg py-4 px-8 flex justify-between items-center">
        <img src="saokosushi2.png" className="h-6" alt="Logo Saoko Sushi" />
        <nav className="flex gap-4 font-semibold">
          <a href="#menu" className="hover:text-orange-500">Menú</a>
          <a href="#reservas" className="hover:text-orange-500">Reservas</a>
{/*           <a href="/admin-login" className="hover:text-orange-500">Admin</a>
 */}        </nav>
      </header>

      {/* BANNER */}
      <section className="bg-[url(banner.jpg)] h-svh flex flex-col items-center justify-center mt-2 text-center">
        <img src="saokosushi3.png" alt="Sushi Banner" className="max-w-dvw mb-4" />
        <p className="font-serif font-light text-2xl max-w-xl">Todo lo bueno está en el sushi.</p>
        <div className="mt-4 flex gap-4">
          <a href="#menu">
            <button className="bg-orange-500 hover:bg-gray-800 text-white text-xl font-bold py-2 px-4 rounded">
              Ordenar ahora!
            </button>
          </a>
        </div>
      </section>

      

      {/* FORMULARIO DE PEDIDO */}
      {mostrarFormulario && (
        <FormularioPedido
          carrito={carrito}
          total={total}
          onClose={() => setMostrarFormulario(false)}
        />
      )}

      {/* MENÚ DE PRODUCTOS */}
      <section id="menu" className="py-16 px-8 bg-gray-800 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Menu SaokoSushi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {productos.length === 0 ? (
            <p className="col-span-full text-center">Cargando productos...</p>
          ) : (
            productos.map(producto => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                agregarAlCarrito={agregarAlCarrito}
              />
            ))
          )}
        </div>
      </section>

      {/* RESERVAS */}
      <section id="reservas" className="py-16 px-8 bg-gray-700 scroll-mt-20">
        <h2 className="text-2xl font-bold text-center mb-4">Reservas</h2>
        <p className="text-center mb-4">
          Para realizar una reserva, contáctanos directamente por WhatsApp. ¡Te esperamos!
        </p>
        <div className="flex flex-col items-center gap-4 mb-4">
          <a
            href="https://wa.me/584144528381" // Reemplaza con el número de WhatsApp real de tu negocio
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition"
            
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path d="M16.72 13.06c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1.01-1 2.47 0 1.46 1.03 2.87 1.18 3.07.14.19 2.03 3.1 4.93 4.23.69.29 1.23.46 1.65.59.69.22 1.32.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z" />
            </svg>
            WhatsApp
          </a>
          <div className="text-center">
            <p className="font-semibold">Horario de atención:</p>
            <p>Lunes a Domingo: 12:00 pm - 10:00 pm</p>
          </div>
           <div className="text-center">
            <p className="font-semibold mb-1">Ubicación:</p>
            <a
              href="https://maps.app.goo.gl/TcsfbNmWKiXXrRLj6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition justify-center mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
              </svg>
              Ver en Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Carla Jimenez, Luis Hernandez & Samuel Carias. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;
