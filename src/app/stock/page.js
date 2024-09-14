"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaBox } from 'react-icons/fa'; // Íconos para mejorar la presentación

export default function Stock() {
  const urldev = "http://localhost";
  const prod = "https://envivo.top"
  const url = `${prod}:9000`;
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductos();
  }, [searchTerm]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${url}/api/stock`, {
        params: { search: searchTerm },
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-2">
      {/* Título */}
      

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 
               bg-gradient-to-r from-red-500 to-yellow-500 
               text-transparent bg-clip-text 
               shadow-lg 
               p-4 rounded-lg border border-gray-200">
                <FaBox className="text-blue-600" /> Consulta de Stock
            </h1>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar productos..."
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute top-4 right-4 text-gray-400" />
        </div>
      </div>

      {/* Grilla de productos */}
      <div className="bg-white shadow-lg rounded-lg p-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos</h2>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto border border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Producto
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {producto.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.precio_venta ? `S/ ${producto.precio_venta}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
