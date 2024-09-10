"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Login from "../login/page"; // Ajusta la ruta según tu estructura de archivos

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precioVenta, setPrecioVenta] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeVenta, setMensajeVenta] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [totalVenta, setTotalVenta] = useState(0);
  const [ventaInfo, setVentaInfo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const local = "http://localhost:9000";
  const url = "https://envivo.top:9000";

  useEffect(() => {
    // Verificar el token en localStorage cuando el componente se monta
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      // Obtener todos los productos al cargar la página
      const fetchProductos = async () => {
        try {
          const response = await axios.get(`${url}/api/productos`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProductos(response.data);
        } catch (error) {
          console.error("Error al obtener los productos:", error);
        }
      };

      fetchProductos();
    }
  }, [loggedIn]);

  const handleProductoChange = (producto) => {
    setProductoSeleccionado(producto);
    setPrecioVenta(producto.precio_venta);
    setCantidad(1); // Resetear cantidad al cambiar de producto
    updateTotalVenta(1, producto.precio_venta);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const handleCantidadChange = (e) => {
    setCantidad(e.target.value);
    updateTotalVenta(e.target.value, precioVenta);
  };

  const handlePrecioVentaChange = (e) => {
    setPrecioVenta(e.target.value);
    updateTotalVenta(cantidad, e.target.value);
  };

  const updateTotalVenta = (cantidad, precioVenta) => {
    if (cantidad && precioVenta) {
      setTotalVenta(cantidad * parseFloat(precioVenta));
    } else {
      setTotalVenta(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productoSeleccionado) {
      setMensaje("Selecciona un producto antes de registrar la venta.");
      return;
    }

    if (cantidad > productoSeleccionado.stock) {
      setMensaje(
        `No se puede realizar la venta. Stock disponible: ${productoSeleccionado.stock}.`
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/ventas/crear`,
        {
          producto_id: productoSeleccionado.id,
          cantidad,
          precio_venta: precioVenta,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const nuevaVenta = response.data;

      // Actualizar el stock del producto en la lista
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === productoSeleccionado.id
            ? { ...producto, stock: producto.stock - cantidad }
            : producto
        )
      );

      setVentaInfo({
        id: nuevaVenta.id,
        producto: productoSeleccionado.nombre,
        cantidad: nuevaVenta.cantidad,
        total: nuevaVenta.total,
        hora: dayjs(nuevaVenta.createdAt).format("HH:mm:ss"),
      });

      setMensajeVenta(`Venta registrada correctamente.`);
      setMensaje(""); // Limpiar mensaje de error
      setCantidad(1);
      setProductoSeleccionado(null);
      setPrecioVenta("");
      setTotalVenta(0);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      setMensaje("Error al registrar la venta.");
      setMensajeVenta("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      {!loggedIn ? (
        <Login onLogin={(status) => setLoggedIn(status)} />
      ) : (
        <>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md w-full mb-6 hover:bg-red-700 transition ease-in-out duration-150"
          >
            Cerrar Sesión
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Registrar Venta</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lista de productos */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Productos</h2>
              <input
                type="text"
                value={busqueda}
                onChange={handleBusquedaChange}
                placeholder="Buscar producto por nombre"
                className="mb-4 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="max-h-[calc(100vh-150px)] overflow-y-auto border border-gray-200 rounded-md">
                <ul className="divide-y divide-gray-200">
                  {productosFiltrados.map((producto) => (
                    <li
                      key={producto.id}
                      onClick={() => handleProductoChange(producto)}
                      className={`cursor-pointer hover:bg-gray-100 p-4 transition ease-in-out duration-150 ${
                        producto.stock === 0 ? "bg-red-100 text-red-600" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-800">
                          {producto.nombre}
                        </span>
                        <span className="text-gray-500">ID: {producto.id}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Precio: S/ {producto.precio_venta} - Stock: {producto.stock}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Formulario para registrar venta */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registrar Venta</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Producto Seleccionado</label>
                  <input
                    type="text"
                    value={productoSeleccionado?.nombre || ""}
                    disabled
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Precio de Venta</label>
                  <input
                    type="number"
                    value={precioVenta}
                    onChange={handlePrecioVentaChange}
                    disabled
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Total Venta</label>
                  <input
                    type="text"
                    value={`S/ ${totalVenta}`}
                    disabled
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition ease-in-out duration-150"
                >
                  Registrar Venta
                </button>
              </form>

              {mensaje && <p className="mt-4 text-red-600">{mensaje}</p>}
              {mensajeVenta && <p className="mt-4 text-green-600">{mensajeVenta}</p>}
            </div>
          </div>

          {/* Mostrar información detallada de la venta */}
          {ventaInfo && (
            <div className="mt-6 bg-gray-100 p-4 rounded-md">
              <h3 className="text-xl font-semibold text-gray-700">Detalles de la Venta</h3>
              <p>ID de Venta: {ventaInfo.id}</p>
              <p>Producto: {ventaInfo.producto}</p>
              <p>Cantidad Vendida: {ventaInfo.cantidad}</p>
              <p>Total: S/ {ventaInfo.total.toFixed(2)}</p>
              <p>Hora de la Venta: {ventaInfo.hora}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
