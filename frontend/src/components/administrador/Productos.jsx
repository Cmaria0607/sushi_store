import React, { useEffect, useState } from 'react';

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <div className="p-8 grid md:grid-cols-3 gap-6">
      {productos.map(producto => (
        <div key={producto.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <img
            src={producto.imagen || '/placeholder.jpg'}
            alt={producto.nombre}
            className="w-40 h-40 object-cover rounded mb-3"
          />
          <h3 className="text-xl font-bold">{producto.nombre}</h3>
          <p className="text-gray-600">{producto.descripcion}</p>
          <span className="text-red-500 font-bold mt-2">${producto.precio_venta}</span>
        </div>
      ))}
    </div>
  );
};

export default Productos;