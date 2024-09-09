import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg">
          Gestión de Tienda
        </h1>
        <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
          <a
            href="/ventas"
            className="bg-white text-blue-500 font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Ventas
          </a>
          <a
            href="/inventario"
            className="bg-white text-blue-500 font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Inventario
          </a>
          <a
            href="/reportes"
            className="bg-white text-blue-500 font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Reportes
          </a>
          <a
            href="/login"
            className="bg-white text-blue-500 font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
