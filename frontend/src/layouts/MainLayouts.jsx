import { Outlet, Link, useLocation } from "react-router-dom";

export default function MainLayouts() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">

        <h1 className="font-bold text-xl">
          Achados & Perdidos ISPT
        </h1>

        <div className="flex gap-4 items-center text-sm">

          <Link
            to="/home"
            className={isActive("/home") ? "font-bold underline" : "hover:underline"}
          >
            Home
          </Link>

          <Link
            to="/objetos"
            className={isActive("/objetos") ? "font-bold underline" : "hover:underline"}
          >
            Objetos
          </Link>

          <Link
            to="/reportar"
            className={isActive("/reportar") ? "font-bold underline" : "hover:underline"}
          >
            Reportar
          </Link>

          <Link
            to="/perfil"
            className={isActive("/perfil") ? "font-bold underline" : "hover:underline"}
          >
            Perfil
          </Link>

          <Link
            to="/"
            className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-200"
          >
            Sair
          </Link>

        </div>
      </nav>

      {/* CONTEÚDO DAS PÁGINAS */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}