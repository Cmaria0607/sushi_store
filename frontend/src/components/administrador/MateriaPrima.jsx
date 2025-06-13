import React, { useEffect, useState } from 'react';

const MateriaPrima = () => {
  const [materias, setMaterias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [materiaActiva, setMateriaActiva] = useState(null);

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = () => {
    fetch('http://127.0.0.1:5000/materia_prima')
      .then(res => res.json())
      .then(data => setMaterias(data))
      .catch(err => console.error('Error al cargar materias primas:', err));
  };

  const handleAgregar = () => {
    setMateriaActiva(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (mp) => {
    setMateriaActiva(mp);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta materia prima?")) {
      fetch(`http://127.0.0.1:5000/materia_prima/${id}`, { method: "DELETE" })
        .then(() => cargarMaterias());
    }
  };

  const handleSave = (datos) => {
    const url = materiaActiva
      ? `http://127.0.0.1:5000/materia_prima/${materiaActiva.id}`
      : "http://127.0.0.1:5000/materia_prima";
    const method = materiaActiva ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then(res => res.json())
      .then(() => {
        setMostrarFormulario(false);
        cargarMaterias();
      });
  };

  const materiasFiltradas = materias.filter(mp =>
    mp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const FormularioMateriaPrima = ({ materia, onClose, onSave }) => {
    const [nombre, setNombre] = useState(materia?.nombre || "");
    const [cantidad, setCantidad] = useState(materia?.cantidad || "");
    const [unidad_medida, setUnidadMedida] = useState(materia?.unidad_medida || "g");
    const [fecha_vencimiento, setFechaVencimiento] = useState(materia?.fecha_vencimiento || "");
    const [costo_unitario, setCostoUnitario] = useState(materia?.costo_unitario || "");
    const [imagen, setImagen] = useState(materia?.imagen || "");

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        nombre,
        cantidad: parseFloat(cantidad),
        unidad_medida,
        fecha_vencimiento,
        costo_unitario: parseFloat(costo_unitario),
        imagen
      });
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-2 mb-4">
        <h3 className="font-bold">{materia ? "Editar" : "Agregar"} Materia Prima</h3>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
        <input value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Cantidad" type="number" required />
        <select value={unidad_medida} onChange={e => setUnidadMedida(e.target.value)} required>
          <option value="g">Gramos (g)</option>
          <option value="unidad">Unidad</option>
        </select>
        <input value={fecha_vencimiento} onChange={e => setFechaVencimiento(e.target.value)} placeholder="Fecha de vencimiento" type="date" required />
        <input value={costo_unitario} onChange={e => setCostoUnitario(e.target.value)} placeholder="Costo unitario" type="number" required />
        <input value={imagen} onChange={e => setImagen(e.target.value)} placeholder="URL de imagen (opcional)" />
        <div className="flex gap-2">
          <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded">
            Guardar
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-1 rounded">
            Cancelar
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Materias Primas</h2>
        <button
          onClick={handleAgregar}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Agregar materia prima
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded mb-4"
      />

      {mostrarFormulario && (
        <FormularioMateriaPrima
          materia={materiaActiva}
          onClose={() => setMostrarFormulario(false)}
          onSave={handleSave}
        />
      )}

      <div className="flex flex-col gap-4">
        {materiasFiltradas.map(materia_prima => (
          <div key={materia_prima.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center md:items-start gap-4">
            <img
              src={materia_prima.imagen || '/placeholder.jpg'}
              alt={materia_prima.nombre}
              className="w-24 h-24 object-cover rounded mb-3"
            />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{materia_prima.nombre}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEditar(materia_prima)} className="text-blue-600 hover:text-blue-800 font-bold">Editar</button>
                  <button onClick={() => handleEliminar(materia_prima.id)} className="text-red-600 hover:text-red-800 font-bold">Eliminar</button>
                </div>
              </div>
              <p className="text-gray-600">Cantidad: {materia_prima.cantidad} {materia_prima.unidad_medida}</p>
              <p className="text-gray-600">Vence: {materia_prima.fecha_vencimiento}</p>
              <p className="text-gray-600">Costo unitario: ${materia_prima.costo_unitario}</p>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default MateriaPrima;
