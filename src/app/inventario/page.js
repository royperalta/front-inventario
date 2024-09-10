'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Inventario() {

    const local = "http://localhost:9000"
    const url = "https://envivo.top:9000"

    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: '',
        precio_compra: '',
        precio_venta: '',
        stock: '0', // Inicializar como 0 para nuevos productos
        agregar_stock: '0'
    });
    const [mensaje, setMensaje] = useState('');
    const [autenticado, setAutenticado] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const verificarAutenticacion = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAutenticado(true);
                // Obtener todos los productos al cargar la página
                fetchProductos();
            } else {
                setAutenticado(false);
            }
        };

        verificarAutenticacion();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${url}/api/productos`);
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto((prevProducto) => ({
            ...prevProducto,
            [name]: value,
        }));

        // Autocompletar los datos del producto si el campo 'nombre' cambia
        if (name === 'nombre' && value) {
            const productoEncontrado = productos.find(p => p.nombre.toLowerCase() === value.toLowerCase());
            if (productoEncontrado) {
                setNuevoProducto((prevProducto) => ({
                    ...prevProducto,
                    nombre: productoEncontrado.nombre,
                    precio_compra: productoEncontrado.precio_compra,
                    precio_venta: productoEncontrado.precio_venta,
                    stock: productoEncontrado.stock.toString(), // Convertir a string para el input
                    agregar_stock: '0' // Reiniciar agregar_stock
                }));
                setProductoSeleccionado(productoEncontrado);
            } else {
                setNuevoProducto((prevProducto) => ({
                    ...prevProducto,
                    precio_compra: '',
                    precio_venta: '',
                    stock: '0', // Inicializar como 0 para nuevos productos
                    agregar_stock: '0'
                }));
                setProductoSeleccionado(null);
            }
        }
    };

    const handleProductoChange = (producto) => {
        setProductoSeleccionado(producto);
        setNuevoProducto({
            nombre: producto.nombre,
            precio_compra: producto.precio_compra,
            precio_venta: producto.precio_venta,
            stock: producto.stock.toString(), // Convertir a string para el input
            agregar_stock: '0' // Reiniciar agregar_stock
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convertir valores a números
        const stock = parseInt(nuevoProducto.stock, 10) || 0;
        const agregarStock = parseInt(nuevoProducto.agregar_stock, 10) || 0;

        try {
            if (productoSeleccionado) {
                // Si el producto ya existe, actualizar
                await axios.put(`${url}/api/productos/actualizar/${productoSeleccionado.id}`, {
                    ...nuevoProducto,
                    stock: stock + agregarStock // Sumar el stock existente con el nuevo stock
                });
                setMensaje('Producto actualizado correctamente.');
            } else {
                // Si es un nuevo producto, crear
                await axios.post(`${url}/api/productos/crear`, {
                    ...nuevoProducto,
                    stock: stock + agregarStock // Establecer el stock inicial
                });
                setMensaje('Producto creado correctamente.');
            }
            // Limpiar el formulario y refrescar la lista de productos
            setNuevoProducto({ nombre: '', precio_compra: '', precio_venta: '', stock: '0', agregar_stock: '0' });
            setProductoSeleccionado(null);
            fetchProductos();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            setMensaje('Error al guardar el producto.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/login`, { usuario, contrasena });
            localStorage.setItem('token', response.data.token);
            setAutenticado(true);
            setUsuario('');
            setContrasena('');
            fetchProductos();
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setMensaje('Error al iniciar sesión.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAutenticado(false);
        setProductos([]);
        setMensaje('Has cerrado sesión.');
    };

    if (!autenticado) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Inicio de Sesión</h1>
                <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition ease-in-out duration-150"
                    >
                        Iniciar Sesión
                    </button>
                    {mensaje && <p className="mt-4 text-red-600">{mensaje}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Inventario</h1>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md mb-6 hover:bg-red-700 transition ease-in-out duration-150"
            >
                Cerrar Sesión
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lista de productos */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Productos</h2>
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto border border-gray-200 rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {productos.map((producto) => (
                                <li
                                    key={producto.id}
                                    onClick={() => handleProductoChange(producto)}
                                    className="cursor-pointer hover:bg-gray-100 p-4 transition ease-in-out duration-150"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium text-gray-800">{producto.nombre}</span>
                                        <span className="text-gray-500">ID: {producto.id}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Precio Compra: S/ {producto.precio_compra.toFixed(2)} - Precio Venta: S/ {producto.precio_venta.toFixed(2)} - Stock: {producto.stock}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Formulario para agregar/actualizar producto */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agregar/Actualizar Producto</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                            <input
                                type="text"
                                name="nombre"
                                value={nuevoProducto.nombre}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                list="productos-autocompletado"
                                autoComplete="off"
                            />
                            <datalist id="productos-autocompletado">
                                {productos.map((producto) => (
                                    <option key={producto.id} value={producto.nombre} />
                                ))}
                            </datalist>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Precio Compra</label>
                            <input
                                type="number"
                                name="precio_compra"
                                value={nuevoProducto.precio_compra}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                step="0.01" // Permite decimales
                                min="0" // Evita números negativos
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Precio Venta</label>
                            <input
                                type="number"
                                name="precio_venta"
                                value={nuevoProducto.precio_venta}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                step="0.01" // Permite decimales
                                min="0" // Evita números negativos
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={nuevoProducto.stock}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                disabled // Campo de stock bloqueado
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Agregar al Stock</label>
                            <input
                                type="number"
                                name="agregar_stock"
                                value={nuevoProducto.agregar_stock}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition ease-in-out duration-150"
                        >
                            {productoSeleccionado ? 'Actualizar Producto' : 'Crear Producto'}
                        </button>
                    </form>

                    {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
                </div>
            </div>
        </div>
    );
}
