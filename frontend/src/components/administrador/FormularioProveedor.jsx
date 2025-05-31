import React, { useEffect, useState } from "react";

const FormularioProveedor = ({ proveedor, onClose, onSave }) => {
  const [nombre, setNombre] = useState(proveedor?.nombre || "");
  const [telefono, setTelefono] = useState(proveedor?.telefono || "");
  const [email, setEmail] = useState(proveedor?.email || "");
  const [direccion, setDireccion] = useState(proveedor?.direccion || "");
  const [materiasPrimas, setMateriasPrimas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState(
    proveedor?.materias_primas?.map(materia_prima => materia_prima.id) || []
  );

  useEffect(() => {
    fetch("http://127.0.0.1:5000/materia_prima/")
      .then(res => res.json())
      .then(data => setMateriasPrimas(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = {
      nombre,
      telefono,
      email,
      direccion,
      materia_prima: seleccionadas
    };
    console.log(datos);
    onSave(datos);
  };

  const handleSeleccion = (id) => {
    setSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-2 mb-4">
      <h3 className="font-bold">{proveedor ? "Editar" : "Agregar"} Proveedor</h3>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
      <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección" required />
      <div>
        <label className="font-semibold">Materia(s) prima(s) que provee:</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {materiasPrimas.map(materia_prima => (
            <label key={materia_prima.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={seleccionadas.includes(materia_prima.id)}
                onChange={() => handleSeleccion(materia_prima.id)}
              />
              {materia_prima.nombre}
            </label>
          ))}
        </div>
      </div>
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

export default FormularioProveedor;