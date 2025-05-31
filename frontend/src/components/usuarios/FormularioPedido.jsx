import React, { useState } from 'react';

const FormularioPedido = ({ carrito, onClose, vaciarCarrito }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [mensajeExito, setMensajeExito] = useState('');

  const total = carrito.reduce((sum, p) => sum + (p.precio_venta || p.precio) * p.cantidad, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pedido = {
      nombre,
      direccion,
      metodo_pago: metodoPago,
      productos: carrito.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio
      })),
      total
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        setMensajeExito('¡Pedido enviado!');
        setNombre('');
        setDireccion('');
        vaciarCarrito(); // ✅ Vacía el carrito

        setTimeout(() => {
          setMensajeExito('');
          onClose(); // ✅ Solo cerrar
        }, 1000);
      } else {
        console.error('Error al enviar pedido');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">Formulario de Pedido</h2>
        {mensajeExito && <p className="text-green-600 mb-4 text-center">{mensajeExito}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!!mensajeExito}
            />
          </div>
          <div>
            <label className="block mb-1">Dirección:</label>
            <input
              type="text"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!!mensajeExito}
            />
          </div>
          <div>
            <label className="block mb-1">Método de pago:</label>
            <select
              value={metodoPago}
              onChange={e => setMetodoPago(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={!!mensajeExito}
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="pago móvil">Pago Móvil</option>
              <option value="tarjeta de crédito">Tarjeta de Crédito</option>
              <option value="tarjeta de débito">Tarjeta de Débito</option>
              <option value="bitcoin">Binance</option>
              <option value="ethereum">Zelle</option>
            </select>
          </div>
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              disabled={!!mensajeExito}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              disabled={!!mensajeExito}
            >
              Enviar pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPedido;

// Este componente maneja el formulario de pedido, permitiendo al usuario ingresar su información y enviar el pedido.
// Se utiliza para capturar el nombre, dirección y método de pago del usuario.
// Al enviar el formulario, se envía una solicitud POST al backend con los detalles del pedido.