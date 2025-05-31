import React, { useEffect, useState } from "react";

const ESTADOS = {
  pendiente: "bg-yellow-100 border-yellow-400 text-yellow-800",
  entregado: "bg-green-100 border-green-400 text-green-800",
  cancelado: "bg-red-100 border-red-400 text-red-800"
};

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/pedidos")
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);

  const actualizarEstado = (id, nuevoEstado) => {
    fetch(`http://127.0.0.1:5000/pedidos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    })
      .then(res => res.json())
      .then(data => {
        setPedidos(prev =>
          prev.map(p => (p.id === id ? { ...p, estado: nuevoEstado } : p))
        );
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pedidos Recibidos</h2>
      <div className="flex flex-col gap-4">
        {pedidos.map(pedido => (
          <div
            key={pedido.id}
            className={`border-l-4 p-4 rounded shadow ${ESTADOS[pedido.estado] || ESTADOS.pendiente}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Pedido #{pedido.id}</h3>
              <span className="capitalize font-bold">{pedido.estado}</span>
            </div>
            <p><b>Cliente:</b> {pedido.nombre}</p>
            <p><b>Dirección:</b> {pedido.direccion}</p>
            <p><b>Método de pago:</b> {pedido.metodo_pago}</p>
            <p><b>Total:</b> ${pedido.total}</p>
            <div className="mt-2">
              <b>Productos:</b>
              <ul className="list-disc ml-6">
                {(pedido.detalles || []).map((prod, idx) => (
                  <li key={idx}>
                    {prod.producto.nombre} x{prod.cantidad} - ${prod.producto.precio_venta}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 mt-4">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={pedido.estado === "entregado"}
                  onChange={() => actualizarEstado(pedido.id, "entregado")}
                  disabled={pedido.estado === "entregado"}
                />
                Entregado
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={pedido.estado === "cancelado"}
                  onChange={() => actualizarEstado(pedido.id, "cancelado")}
                  disabled={pedido.estado === "cancelado"}
                />
                Cancelado
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedidosAdmin;