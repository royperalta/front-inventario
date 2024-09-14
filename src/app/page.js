import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-white mb-10 drop-shadow-lg tracking-wide">
          Gestión de Tienda
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-lg mx-auto">
          <a
            href="/ventas"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Ventas
          </a>
          <a
            href="/inventario"
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Inventario
          </a>
          <a
            href="/reportes"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Reportes
          </a>
          <a
            href="/login"
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
