"use client";
import { useState, useEffect } from 'react';
import Login from '../login/page'; // Ajusta la ruta según tu estructura de archivos

const VentasPorDia = () => {
    const urldev = "http://localhost";
    const prod = "https://envivo.top";
    const url = `${prod}:9000`;
    const [ventas, setVentas] = useState([]);
    const [totalVendidoDia, setTotalVendidoDia] = useState(0);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]); // Inicializa con la fecha actual
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoggedIn(true);
            fetchVentas(token); // Obtener ventas del día actual
        } else {
            setLoggedIn(false);
        }
    }, []);

    const fetchVentas = async (token, fecha = '') => {
        try {
            const headers = new Headers({ 'Authorization': `Bearer ${token}` });
            const response = await fetch(`${url}/api/reportes/ventas-por-dia?fecha=${fecha}`, { headers });
            const data = await response.json();

            if (response.ok) {
                setVentas(data.ventas);
                setTotalVendidoDia(data.totalVendidoDia);
            } else {
                console.error('Error al obtener las ventas:', data.error);
            }
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

    const handleFechaChange = (e) => {
        const fecha = e.target.value;
        setFechaSeleccionada(fecha);
        const token = localStorage.getItem('token');
        fetchVentas(token, fecha); // Busca ventas cuando la fecha cambia
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
    };

    if (!loggedIn) {
        return <Login onLogin={(status) => setLoggedIn(status)} />;
    }

    return (
        <div className="p-2 space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Ventas por Día</h1>
            <div className="mb-4">
                <input
                    type="date"
                    value={fechaSeleccionada}
                    onChange={handleFechaChange}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Total Vendido: S/{totalVendidoDia}</h2>
                <h3 className="text-lg font-semibold">Ventas:</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-4 border-b">Producto</th>
                                <th className="py-2 px-4 border-b">Cantidad</th>
                                <th className="py-2 px-4 border-b">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map(venta => (
                                <tr key={venta.id} className="hover:bg-gray-100 transition-colors duration-200">
                                    <td className="py-2 px-4 border-b">{venta.Producto.nombre}</td>
                                    <td className="py-2 px-4 border-b">{venta.cantidad}</td>
                                    <td className="py-2 px-4 border-b">S/{venta.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default VentasPorDia;
