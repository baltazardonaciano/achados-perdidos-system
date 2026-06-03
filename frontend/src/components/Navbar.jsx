import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

import {
  FaHome,
  FaBoxOpen,
  FaPlusCircle,
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBell,
  FaClipboardList,
  FaUsers
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🌙 tema
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  function toggleTema() {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.remove("dark");
      localStorage.setItem("tema", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("tema", "dark");
    }

    setDarkMode(!darkMode);
  }

  // 🚪 logout
  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  // 🔔 notificações
  useEffect(() => {
    async function load() {
      if (!user) return;

      try {
        const userId = user.id || user.estudante_id;
        const res = await api.get(`/notificacoes/${userId}`);
        setNotificacoes(res.data);
      } catch (err) {
        console.log("Erro notificações:", err.message);
      }
    }

    load();
  }, [user]);

  async function marcarComoLida(id) {
    try {
      await api.patch(`/notificacoes/${id}/lida`);

      setNotificacoes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, lida: true } : n
        )
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  // fechar dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdminOuFuncionario =
    user?.role === "admin" || user?.role === "funcionario";

  return (
    <nav className="bg-blue-700 dark:bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">

      {/* LOGO */}
      <div>
        <h1 className="text-2xl font-bold">
          Achados & Perdidos
        </h1>

        <p className="text-sm text-blue-100">
          ISPT - Sistema Institucional
        </p>
      </div>

      {/* MENU */}
      <div className="flex gap-4 items-center relative">

        {/* 🔔 NOTIFICAÇÕES */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="text-xl relative hover:text-gray-200"
          >
            <FaBell />

            {naoLidas > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 rounded-full">
                {naoLidas}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-xl shadow-xl z-50 overflow-hidden">

              <div className="p-3 font-bold border-b">
                Notificações
              </div>

              {notificacoes.length === 0 ? (
                <p className="p-4 text-gray-500">
                  Sem notificações
                </p>
              ) : (
                notificacoes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => marcarComoLida(n.id)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                      n.lida ? "opacity-60" : "font-semibold"
                    }`}
                  >
                    🔔 {n.mensagem}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🌙 TEMA */}
        <button
          onClick={toggleTema}
          className="text-xl hover:text-gray-200"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* HOME */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 hover:text-gray-200"
        >
          <FaHome />
          Home
        </button>

        {/* OBJETOS */}
        <button
          onClick={() => navigate("/objetos")}
          className="flex items-center gap-2 hover:text-gray-200"
        >
          <FaBoxOpen />
          Objetos
        </button>

        {/* REPORTAR (SÓ ADMIN/FUNCIONÁRIO) */}
        {isAdminOuFuncionario && (
          <button
            onClick={() => navigate("/reportar")}
            className="flex items-center gap-2 hover:text-gray-200"
          >
            <FaPlusCircle />
            Reportar
          </button>
        )}

        {/* ADMIN E FUNCIONÁRIO */}
        {isAdminOuFuncionario && (
          <>
            <button
              onClick={() => navigate("/admin/reivindicacoes")}
              className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600"
            >
              <FaClipboardList />
              Reivindicações
            </button>

            <button
              onClick={() => navigate("/admin/utilizadores")}
              className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
            >
              <FaUsers />
              Utilizadores
            </button>
          </>
        )}

        {/* PERFIL */}
        <button
          onClick={() => navigate("/perfil")}
          className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg"
        >
          <FaUser />
          Perfil
        </button>

        {/* SAIR */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt />
          Sair
        </button>

      </div>
    </nav>
  );
}