import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    precio_venta: '',
    agotado: false
  });
  const [mensaje, setMensaje] = useState('');
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [materiasPorProducto, setMateriasPorProducto] = useState({});

  useEffect(() => {
    cargarProductos();
    cargarMateriasPrimas();
  }, []);

  const cargarProductos = () => {
    axios.get('http://localhost:5000/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  };

  const cargarMateriasPrimas = () => {
    axios.get('http://localhost:5000/materia_prima/')
      .then(res => setMateriasPrimas(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleSeleccionMateria = (id) => {
    setSeleccionadas(prev => {
      const existe = prev.find(mp => mp.id === id);
      if (existe) {
        return prev.filter(mp => mp.id !== id);
      } else {
        return [...prev, { id, cantidad: '' }];
      }
    });
  };

  const handleCantidadMateria = (id, cantidad) => {
    setSeleccionadas(prev =>
      prev.map(mp => mp.id === id ? { ...mp, cantidad: parseFloat(cantidad) || 0 } : mp)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && idEditar) {
        await axios.put(`http://localhost:5000/productos/${idEditar}`, producto);
        setMensaje('Producto actualizado correctamente');
      } else {
        const resProducto = await axios.post('http://localhost:5000/productos/', producto);
        const productoId = resProducto.data.id;

        for (const materia of seleccionadas) {
          await axios.post('http://localhost:5000/materia_prima/asociar', {
            producto_id: productoId,
            materia_prima_id: materia.id,
            cantidad: materia.cantidad
          });

          const materiaBase = materiasPrimas.find(mp => mp.id === materia.id);
          const nuevaCantidad = parseFloat(materiaBase.cantidad) - parseFloat(materia.cantidad);

          await axios.put(`http://localhost:5000/materia_prima/${materia.id}`, {
            cantidad: nuevaCantidad,
          });
        }

        setMensaje('Producto creado exitosamente!');
      }

      setProducto({ nombre: '', descripcion: '', imagen: '', precio_venta: '', agotado: false });
      setSeleccionadas([]);
      setBusqueda('');
      setShowForm(false);
      setModoEdicion(false);
      setIdEditar(null);
      cargarProductos();
    } catch (err) {
      console.error(err);
      setMensaje('Error al procesar el producto');
    }
  };

  const editarProducto = (producto) => {
    setProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      precio_venta: producto.precio_venta,
      agotado: producto.agotado
    });
    setIdEditar(producto.id);
    setModoEdicion(true);
    setShowForm(true);
    setMensaje('');
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/productos/${id}`);
        setMensaje('Producto eliminado correctamente');
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto', error);
        setMensaje('Error al eliminar el producto');
      }
    }
  };

  const toggleDetalles = async (id) => {
    if (materiasPorProducto[id]) {
      setDetallesVisibles(prev => ({ ...prev, [id]: !prev[id] }));
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/productos/${id}/materia_prima`);
      setMateriasPorProducto(prev => ({ ...prev, [id]: res.data }));
      setDetallesVisibles(prev => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error('Error al cargar materias primas del producto', error);
    }
  };

  const materiasFiltradas = materiasPrimas.filter(mp =>
    mp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <button
        onClick={() => {
          setShowForm(!showForm);
          setMensaje('');
          setModoEdicion(false);
          setProducto({ nombre: '', descripcion: '', imagen: '', precio_venta: '', agotado: false });
        }}
        className="mb-6 px-4 py-2 bg-orange-600 text-white rounded hover:bg-gray-800"
      >
        {showForm ? 'Cancelar' : 'Agregar Producto'}
      </button>

      {mensaje && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 font-semibold">
          {mensaje}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow-md space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={producto.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={producto.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="imagen"
            placeholder="URL de la imagen"
            value={producto.imagen}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="precio_venta"
            placeholder="Precio de venta"
            value={producto.precio_venta}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <h3 className="font-semibold mt-4">Selecciona las materias primas:</h3>

          <input
            type="text"
            placeholder="Buscar materia prima..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {materiasFiltradas.map(mp => (
              <div key={mp.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!seleccionadas.find(s => s.id === mp.id)}
                  onChange={() => handleSeleccionMateria(mp.id)}
                />
                <label className="flex-grow">{mp.nombre}</label>
                {seleccionadas.find(s => s.id === mp.id) && (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Cantidad"
                    className="w-24 p-1 border rounded"
                    value={seleccionadas.find(s => s.id === mp.id).cantidad}
                    onChange={(e) => handleCantidadMateria(mp.id, e.target.value)}
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 bg-orange-500 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded"
          >
            {modoEdicion ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </form>
      )}

      <div className="p-8 grid md:grid-cols-3 gap-6">
        {productos.map(producto => (
          <div
            key={producto.id}
            className={`bg-white rounded-lg shadow p-4 flex flex-col items-center ${producto.agotado ? 'opacity-50' : ''}`}
          >
            <img
              src={producto.imagen || '/placeholder.jpg'}
              alt={producto.nombre}
              className="w-40 h-40 object-cover rounded mb-3"
            />
            <h3 className="text-xl font-bold">{producto.nombre}</h3>
            <p className="text-gray-600">{producto.descripcion}</p>
            <span className="text-red-500 font-bold mt-2">${producto.precio_venta}</span>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => editarProducto(producto)}
                className="px-3 py-1 rounded bg-orange-500 hover:bg-gray-800 text-white"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarProducto(producto.id)}
                className="px-3 py-1 rounded bg-orange-500 hover:bg-gray-800 text-white"
              >
                Eliminar
              </button>
            </div>

            <button
              onClick={() => toggleDetalles(producto.id)}
              className="mt-2 px-3 py-1 rounded bg-gray-800 hover:bg-orange-600 text-white"
            >
              {detallesVisibles[producto.id] ? 'Ocultar Detalles' : 'Ver Detalles'}
            </button>

            {detallesVisibles[producto.id] && materiasPorProducto[producto.id] && (
              <div className="mt-4 w-full text-left border-t pt-2">
                <h4 className="font-semibold mb-2">Materias Primas:</h4>
                <ul className="list-disc list-inside">
                  {materiasPorProducto[producto.id].map(mp => (
                    <li key={mp.id}>
                      {mp.nombre}: {mp.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;
