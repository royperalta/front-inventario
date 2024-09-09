'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:9000/api/auth/login', { username, password });
            if (response.status === 200) {
                // Guardar el token en el almacenamiento local o en cookies
                localStorage.setItem('token', response.data.token);
                // Redirigir al usuario a la página principal
                router.push('/');
            }
        } catch (err) {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
                onClick={handleLogin}
                className="w-full p-3 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
            >
                Iniciar Sesión
            </button>
        </div>
    );
}
