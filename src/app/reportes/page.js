'use client';
import { useState, useEffect } from 'react';
import Login from '../login/page'; // Ajusta la ruta según tu estructura de archivos

const Reportes = () => {

    const local = "http://localhost:9000"
    const url = "https://envivo.top:9000"
    const [totalVendido, setTotalVendido] = useState(0);
    const [totalInvertido, setTotalInvertido] = useState(0);
    const [totalGanado, setTotalGanado] = useState(0);
    const [productos, setProductos] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [filtroProducto, setFiltroProducto] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        if (!loggedIn) return;

        const fetchReportes = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = new Headers({ 'Authorization': `Bearer ${token}` });

                const responseVendido = await fetch(`${url}/api/reportes/total-vendido`, { headers });
                const dataVendido = await responseVendido.json();
                setTotalVendido(dataVendido.totalVendido || 0);

                const responseInvertido = await fetch(`${url}/api/reportes/total-invertido`, { headers });
                const dataInvertido = await responseInvertido.json();
                setTotalInvertido(dataInvertido.totalInvertido || 0);

                const responseGanado = await fetch(`${url}/api/reportes/total-ganado`, { headers });
                const dataGanado = await responseGanado.json();
                setTotalGanado(dataGanado.totalGanado || 0);
            } catch (error) {
                console.error('Error al obtener los reportes:', error);
            }
        };

        const fetchProductos = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = new Headers({ 'Authorization': `Bearer ${token}` });

                const response = await fetch(`${url}/api/productos`, { headers });
                const data = await response.json();
                setProductos(data);
                filtrarProductos(data, filtroProducto);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        const fetchVentas = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = new Headers({ 'Authorization': `Bearer ${token}` });

                const response = await fetch(`${url}/api/ventas`, { headers });
                const data = await response.json();
                setVentas(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };

        fetchReportes();
        fetchProductos();
        fetchVentas();
    }, [filtroProducto, loggedIn]);

    const filtrarProductos = (productos, filtro) => {
        const productosFiltrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(filtro.toLowerCase())
        );
        setProductosFiltrados(productosFiltrados);
    };

    const calcularMetricasPorProducto = (producto) => {
        if (!Array.isArray(ventas)) {
            console.error('Ventas no es un array');
            return {
                cantidadVendida: 0,
                totalInvertido: 0,
                totalGanado: 0
            };
        }

        const ventasProducto = ventas.filter(venta => venta.producto_id === producto.id);
        const cantidadVendida = ventasProducto.reduce((total, venta) => total + venta.cantidad, 0);
        const totalVendido = ventasProducto.reduce((total, venta) => total + venta.total, 0);
        const totalInvertido = cantidadVendida * producto.precio_compra;
        const totalGanado = totalVendido - totalInvertido;

        return {
            cantidadVendida,
            totalInvertido,
            totalGanado
        };
    };

    const handleFiltroChange = (e) => {
        setFiltroProducto(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
    };

    if (!loggedIn) {
        return <Login onLogin={(status) => setLoggedIn(status)} />;
    }

    return (
        <div className="p-6 space-y-6">
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md mb-6 hover:bg-red-700 transition ease-in-out duration-150"
            >
                Cerrar Sesión
            </button>
            <h1 className="text-3xl font-bold mb-4">Reportes</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Total Vendido</h2>
                    <p className="text-2xl font-bold text-green-600">S/{totalVendido}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Total Invertido</h2>
                    <p className="text-2xl font-bold text-red-600">S/{totalInvertido}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Total Ganado</h2>
                    <p className="text-2xl font-bold text-blue-600">S/{totalGanado}</p>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Filtro de Productos</h2>
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filtroProducto}
                    onChange={handleFiltroChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <h3 className="text-lg font-semibold mt-6">Productos Filtrados</h3>
                <ul className="space-y-4">
                    {productosFiltrados.map(producto => {
                        const { cantidadVendida, totalInvertido, totalGanado } = calcularMetricasPorProducto(producto);

                        return (
                            <li key={producto.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{producto.nombre}</span>
                                    <span className="text-sm text-gray-500">Cantidad Vendida: {cantidadVendida}</span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm">Invertido: S/{totalInvertido.toFixed(2)}</p>
                                    <p className="text-sm">Ganancia: S/{totalGanado.toFixed(2)}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Reportes;
