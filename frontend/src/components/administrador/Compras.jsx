import React, { useEffect, useState } from 'react';

const Compras = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/compras')
      .then(res => res.json())
      .then(data => setCompras(data))
      .catch(err => console.error('Error al cargar compras:', err));
  }, []);

  return (
    <div className="p-8 grid md:grid-cols-3 gap-6">
      {compras.map(compra => (
        <div key={compra.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-bold mb-2">Compra #{compra.id}</h3>
          <p className="text-gray-600">Cantidad: {compra.cantidad}</p>
          <p className="text-gray-600">Materia Prima: {compra.materia_prima?.nombre}</p>
          <p className="text-gray-600">Proveedor: {compra.proveedor?.nombre}</p>
        </div>
      ))}
    </div>
  );
};

export default Compras;