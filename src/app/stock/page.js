'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Stock() {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductos();
  }, [searchTerm]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/stock', {
        params: { search: searchTerm }
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Consulta de Stock</h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos</h2>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto border border-gray-200 rounded-md">
          <ul className="divide-y divide-gray-200">
            {productos.map((producto) => (
              <li key={producto.id} className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">{producto.nombre}</span>
                  <span className="text-gray-500">Stock: {producto.stock}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
