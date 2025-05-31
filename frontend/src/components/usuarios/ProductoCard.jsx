import React from 'react';

const ProductoCard = ({ producto, agregarAlCarrito }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col items-center">
      <img
        src={producto.imagen || "https://via.placeholder.com/150"}
        alt={producto.nombre}
        className="w-32 h-32 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{producto.nombre}</h3>
      <p className="text-orange-400 font-semibold mb-2">${producto.precio_venta}</p>
      <p className="text-gray-300 text-sm mb-4">{producto.descripcion}</p>
      <button
        onClick={() => agregarAlCarrito(producto)}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductoCard;
