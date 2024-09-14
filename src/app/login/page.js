'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
    const url = "https://envivo.top:9000";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        try {
            const response = await axios.post(`${url}/api/auth/login`, { username, password });
            if (response.status === 200) {
                // Guardar el token en el almacenamiento local o en cookies
                localStorage.setItem('token', response.data.token);
                // Redirigir al usuario a la página principal
                router.push('/');
            }
        } catch (err) {
            console.error('Error de inicio de sesión:', err);
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-md bg-white shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h1>
            
            <form onSubmit={handleLogin}>
                <div className="mb-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    />
                </div>
                
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    />
                </div>
                
                {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
                
                <button
                    type="submit"
                    className="w-full p-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:scale-105"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
