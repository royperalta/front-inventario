import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Store Management",
  description: "Sistema de gestión de ventas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <header className="bg-blue-600 text-white p-4">
          <nav className="flex justify-between">
            <div className="font-bold">Store Management</div>
            <div className="space-x-4">
              <Link href="/">Inicio</Link>
              <Link href="/ventas">Ventas</Link>
              <Link href="/inventario">Inventario</Link>
              <Link href="/reportes">Reportes</Link>
              <Link href="/stock">Stock</Link>
              <Link href="/login">Login</Link>
            </div>
          </nav>
        </header>
        <main className="flex-grow py-1">{children}</main>
        <footer className="bg-blue-600 text-white text-center p-2">
          &copy; 2024 Store Management
        </footer>
      </body>
    </html>
  );
}
