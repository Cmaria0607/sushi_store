import React, { useEffect, useState } from 'react';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/pedidos')
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error('Error al cargar pedidos:', err));
  }, []);

  return (
    <div className="p-8 grid md:grid-cols-2 gap-6">
      {pedidos.map(pedido => (
        <div key={pedido.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-bold mb-2">Pedido #{pedido.id}</h3>
          <p className="text-gray-600">Fecha: {pedido.fecha}</p>
          <p className="text-gray-600">Total: ${pedido.total}</p>
          <div className="mt-2">
            <h4 className="font-semibold">Detalles:</h4>
            <ul className="list-disc ml-5">
              {pedido.detalles?.map((detalle, idx) => (
                <li key={idx}>
                  {detalle.producto.nombre} - {detalle.cantidad} x ${detalle.producto.precio_venta} = ${detalle.subtotal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pedidos;