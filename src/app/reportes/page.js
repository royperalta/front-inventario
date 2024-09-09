'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Reportes() {
    const [ganancias, setGanancias] = useState(null);
    const [totalVentas, setTotalVentas] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener las ganancias esperadas y el total de ventas al cargar el componente
        const fetchDatos = async () => {
            try {
                // Obtener las ganancias esperadas
                const gananciasResponse = await axios.get('http://localhost:9000/api/productos/ganancias-esperadas');
                setGanancias(gananciasResponse.data.gananciasEsperadas);

                // Obtener el total de ventas
                const totalVentasResponse = await axios.get('http://localhost:9000/api/ventas/total-ventas');
                setTotalVentas(totalVentasResponse.data.totalVentas);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setError('Error al obtener los datos');
            }
        };

        fetchDatos();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Reportes</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                {error && <p className="text-red-600">{error}</p>}
                {ganancias !== null ? (
                    <p className="text-lg text-gray-800">Ganancias Esperadas: S/ {ganancias}</p>
                ) : (
                    <p className="text-lg text-gray-800">Cargando ganancias esperadas...</p>
                )}
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
                {error && <p className="text-red-600">{error}</p>}
                {totalVentas !== null ? (
                    <p className="text-lg text-gray-800">Total Vendido: S/ {totalVentas.toFixed(2)}</p>
                ) : (
                    <p className="text-lg text-gray-800">Cargando total vendido...</p>
                )}
            </div>
        </div>
    );
}
