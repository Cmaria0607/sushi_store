import React, { useEffect, useState } from "react";
import FormularioProveedor from "./FormularioProveedor";
import { FaEdit, FaTrash } from "react-icons/fa";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error cargando proveedores:", err));
  }, []);

  const handleAgregar = () => {
    setProveedorActivo(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (proveedor) => {
    setProveedorActivo(proveedor);
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
      fetch(`http://127.0.0.1:5000/proveedores/${id}`, { method: "DELETE" })
        .then(() => setProveedores((prev) => prev.filter((p) => p.id !== id)));
    }
  };

  const handleSave = (datos) => {
    const url = proveedorActivo
      ? `http://127.0.0.1:5000/proveedores/${proveedorActivo.id}`
      : "http://127.0.0.1:5000/proveedores";
    const method = proveedorActivo ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((res) => res.json())
      .then((data) => {
        if (proveedorActivo) {
          setProveedores((prev) =>
            prev.map((p) => (p.id === data.id ? data : p))
          );
        } else {
          setProveedores((prev) => [...prev, data]);
        }
        setMostrarFormulario(false);
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Proveedores</h2>
        <button
          onClick={handleAgregar}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Agregar proveedor
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioProveedor
          proveedor={proveedorActivo}
          onClose={() => setMostrarFormulario(false)}
          onSave={handleSave}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {proveedores.map((proveedor) => (
          <div
            key={proveedor.id}
            className="bg-white rounded shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{proveedor.nombre}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(proveedor)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleEliminar(proveedor.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p>
              <b>Teléfono:</b> {proveedor.telefono}
            </p>
            <p>
              <b>Email:</b> {proveedor.email}
            </p>
            <p>
              <b>Dirección:</b> {proveedor.direccion}
            </p>
            <div>
              <b>Materia(s) prima(s):</b>
              <ul className="list-disc ml-6">
                {(proveedor.materia_prima || []).map((materia_prima) => (
                  <li key={materia_prima.id}>
                    {materia_prima.nombre} ({materia_prima.unidad})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proveedores;