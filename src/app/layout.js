"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBars, FaSignInAlt, FaSignOutAlt, FaHome, FaShoppingCart, FaWarehouse, FaChartLine, FaBox, FaUserCircle } from "react-icons/fa";
import "./globals.css";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Importar useRouter

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const sidebarRef = useRef(null);
  const router = useRouter(); // Instancia de useRouter
  const urldev = "http://localhost";
  const prod = "https://envivo.top";
  const url = `${prod}:9000`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Comprobar en la carga inicial
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${url}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null); // Asegúrate de manejar la sesión expirado o token inválido
      }
    };

    fetchUserProfile();
    const intervalId = setInterval(fetchUserProfile, 60000); // Actualizar cada 60 segundos

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`);
      localStorage.removeItem('token');
      setUser(null);
      router.push('/'); // Redirigir a la página de inicio después de logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(`${url}/api/auth/login`, credentials);
      localStorage.setItem('token', response.data.token);
      // Actualiza el perfil del usuario inmediatamente después del inicio de sesión
      const userResponse = await axios.get(`${url}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });
      setUser(userResponse.data);
      router.push('/'); // Redirigir a la página de inicio o a la página deseada
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <html lang="en">
      <Head>
        <title>Mi Bodeguita</title>
        <meta name="description" content="Sistema de gestión de ventas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="min-h-screen flex flex-col">
        <div
          ref={sidebarRef}
          className={`fixed inset-0 w-64 bg-[#cc1902] text-white z-50 transform transition-transform duration-300 ${isMobile
              ? isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : isSidebarOpen
                ? "block"
                : "hidden"
            } md:hidden`}
        >
          <div className="flex items-center justify-center mt-8">
            <div className="w-24 h-24 bg-gray-500 flex items-center justify-center overflow-hidden rounded-full">
              <img
                src="/logo_sm.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h2 className="text-center text-lg mt-4">Mi Bodeguita</h2>
          <nav className="mt-10">
            <Link href="/" onClick={handleLinkClick} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white flex items-center">
              <FaHome className="inline-block mr-2" /> Inicio
            </Link>
            <Link href="/ventas" onClick={handleLinkClick} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white flex items-center">
              <FaShoppingCart className="inline-block mr-2" /> Vender
            </Link>
            <Link href="/inventario" onClick={handleLinkClick} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white flex items-center">
              <FaWarehouse className="inline-block mr-2" /> Inventario
            </Link>
            <Link href="/reportes" onClick={handleLinkClick} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white flex items-center">
              <FaChartLine className="inline-block mr-2" /> Reportes
            </Link>
            <Link href="/stock" onClick={handleLinkClick} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white flex items-center">
              <FaBox className="inline-block mr-2" /> Stock
            </Link>
            {!user ? (
              <Link href="/login" onClick={handleLinkClick} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white flex items-center">
                <FaSignInAlt className="inline-block mr-2" /> Login
              </Link>
            ) : (
              <>
                <span className="block py-2.5 px-4 rounded-lg transition duration-200 bg-red-800 flex items-center">
                  <FaUserCircle className="inline-block mr-2" /> Hola, {user.username}
                </span>
                <button onClick={handleLogout} className="block py-2.5 px-4 rounded-lg transition duration-200 hover:bg-custom-red hover:text-white w-full text-left flex items-center">
                  <FaSignOutAlt className="inline-block mr-2" /> Logout
                </button>
              </>
            )}
          </nav>
        </div>

        <div className={`flex-grow transition-all duration-300 ${isSidebarOpen && !isMobile ? "ml-64" : ""}`}>
          <header className="bg-[#cc1902] text-white p-4">
            <nav className="flex justify-between items-center">
              <button
                className="text-white p-2 focus:outline-none md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars size={24} />
              </button>
              <div className="font-bold">Mi Bodeguita</div>
              <div className="hidden md:flex space-x-4 items-center">
                <Link href="/" className="flex items-center hover:text-gray-300">
                  <FaHome className="mr-1" /> Inicio
                </Link>
                <Link href="/ventas" className="flex items-center hover:text-gray-300">
                  <FaShoppingCart className="mr-1" /> Ventas
                </Link>
                <Link href="/inventario" className="flex items-center hover:text-gray-300">
                  <FaWarehouse className="mr-1" /> Inventario
                </Link>
                <Link href="/reportes" className="flex items-center hover:text-gray-300">
                  <FaChartLine className="mr-1" /> Reportes
                </Link>
                <Link href="/stock" className="flex items-center hover:text-gray-300">
                  <FaBox className="mr-1" /> Stock
                </Link>
                {!user ? (
                  <Link href="/login" className="flex items-center hover:text-gray-100">
                    <FaSignInAlt className="mr-1" /> Login
                  </Link>
                ) : (
                  <>
                    <span className="flex items-center">
                      <FaUserCircle className="mr-1" /> Hola, {user.username}
                    </span>
                    <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-gray-100">
                      <FaSignOutAlt className="mr-1" /> Logout
                    </button>
                  </>
                )}
              </div>
            </nav>
          </header>

          <main>{children}</main>
        </div>

        <footer className="bg-[#cc1902] text-white text-center p-2">
          &copy; 2024 Store Management
        </footer>
      </body>
    </html>
  );
}
