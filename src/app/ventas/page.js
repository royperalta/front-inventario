"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { FaSearch, FaBox, FaMoneyBillWave } from "react-icons/fa";
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

  const urldev = "http://localhost";
  const prod = "https://envivo.top";
  const url = `${prod}:9000`;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
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
    setCantidad(1);
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
    setTotalVenta(cantidad && precioVenta ? cantidad * parseFloat(precioVenta) : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productoSeleccionado) {
      setMensaje("Selecciona un producto antes de registrar la venta.");
      return;
    }

    if (cantidad > productoSeleccionado.stock) {
      setMensaje(`No se puede realizar la venta. Stock disponible: ${productoSeleccionado.stock}.`);
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

      setMensajeVenta("Venta registrada correctamente.");
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

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto p-2">
      {!loggedIn ? (
        <Login onLogin={(status) => setLoggedIn(status)} />
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 
               bg-gradient-to-r from-red-500 to-yellow-500 
               text-transparent bg-clip-text 
               shadow-lg 
               p-4 rounded-lg border border-gray-200">
            Registrar Venta
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Lista de productos */}
<div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
  <h2 className="text-3xl font-semibold text-gray-900 mb-6 flex items-center">
    <FaBox className="mr-3 text-2xl text-blue-600" />
    Lista de Productos
  </h2>
  <div className="relative mb-6">
    <input
      type="text"
      value={busqueda}
      onChange={handleBusquedaChange}
      placeholder="Buscar producto por nombre"
      className="w-full p-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-500"
    />
    <FaSearch className="absolute top-3 right-3 text-gray-500 text-xl" />
  </div>
  <div className="max-h-[60vh] md:max-h-[80vh] overflow-y-auto border border-gray-200 rounded-md bg-gray-50">
    <ul className="divide-y divide-gray-200">
      {productosFiltrados.map((producto) => (
        <li
          key={producto.id}
          onClick={() => handleProductoChange(producto)}
          className={`cursor-pointer p-4 transition ease-in-out duration-150 ${producto.stock === 0 ? "bg-red-100 text-red-600" : "hover:bg-gray-100"} rounded-md`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium text-gray-800">{producto.nombre}</span>
            <span className={`text-sm ${producto.stock === 0 ? "text-red-600" : "text-gray-500"}`}>ID: {producto.id}</span>
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
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaMoneyBillWave className="mr-3 text-2xl text-green-600" />
                Registrar Venta
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto Seleccionado</label>
                  <input
                    type="text"
                    value={productoSeleccionado?.nombre || ""}
                    disabled
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-md bg-gray-100 text-lg placeholder-gray-500"
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                    min="1"
                    placeholder="Cantidad de producto"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Venta</label>
                  <input
                    type="number"
                    value={precioVenta}
                    onChange={handlePrecioVentaChange}
                    disabled
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-md bg-gray-100 text-lg placeholder-gray-500"
                    step="0.01"
                    placeholder="Precio de venta del producto"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Venta</label>
                  <input
                    type="text"
                    value={`S/ ${totalVenta}`}
                    disabled
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md shadow-md bg-gray-100 text-lg placeholder-gray-500"
                    placeholder="Total de la venta"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 text-white py-3 px-6 rounded-md w-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 duration-300 text-lg font-semibold"
                >
                  Registrar Venta
                </button>
              </form>

              {mensaje && (
                <div className="mt-6 text-red-600 text-lg">
                  {mensaje}
                </div>
              )}

              {mensajeVenta && (
                <div className="mt-6 text-green-600 text-lg">
                  {mensajeVenta}
                </div>
              )}

              {ventaInfo && (
                <div className="mt-8 p-6 border border-gray-300 rounded-md bg-gray-50 text-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Venta Registrada</h3>
                  <p><strong>ID:</strong> {ventaInfo.id}</p>
                  <p><strong>Producto:</strong> {ventaInfo.producto}</p>
                  <p><strong>Cantidad:</strong> {ventaInfo.cantidad}</p>
                  <p><strong>Total:</strong> S/ {ventaInfo.total}</p>
                  <p><strong>Hora:</strong> {ventaInfo.hora}</p>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
