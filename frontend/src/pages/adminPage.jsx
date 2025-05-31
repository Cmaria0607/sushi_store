import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Proveedores from '../components/administrador/Proveedores';
import Compras from '../components/administrador/Compras';
import MateriaPrima from '../components/administrador/MateriaPrima';
import PedidosAdmin from '../components/administrador/PedidosAdmin';
import CrearProducto from '../components/administrador/CrearProducto';

const AdminPage = () => {
  const [vista, setVista] = useState('productos');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sesión al montar el componente
    const auth = localStorage.getItem('authAdmin');
    if (auth !== 'true') {
      navigate('/login'); // Redirigir a login si no está autenticado
    }
  }, [navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('authAdmin');
    navigate('/login'); // Volver al login
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white flex gap-4 p-4 items-center justify-between">
        <div className="flex gap-4">
          <button onClick={() => setVista('productos')}>Productos</button>
          <button onClick={() => setVista('proveedores')}>Proveedores</button>
          {/* <button onClick={() => setVista('compras')}>Compras</button> */}
          <button onClick={() => setVista('materia')}>Materia Prima</button>
          <button onClick={() => setVista('pedidos')}>Pedidos</button>
        </div>
        <button
          onClick={handleCerrarSesion}
          title="Cerrar sesión"
          className="flex items-center gap-1 hover:text-red-400"
        >
          <span>Salir</span>
          <span role="img" aria-label="Salir">🚪</span>
        </button>
      </nav>
      <main className="p-8">
        {vista === 'productos' && <CrearProducto />}
        {vista === 'proveedores' && <Proveedores />}
        {/* {vista === 'compras' && <Compras />} */}
        {vista === 'materia' && <MateriaPrima />}
        {vista === 'pedidos' && <PedidosAdmin />}
      </main>
    </div>
  );
};

export default AdminPage;

