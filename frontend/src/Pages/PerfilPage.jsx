import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function PerfilPage() {
  const [objetos, setObjetos] = useState([]);
  const [user, setUser] = useState(null);

  // 👤 utilizador logado (id vindo do login)
  const userLocal = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (userLocal?.id) {
      fetchUser();
      fetchObjetos();
    }
  }, []);

  // 👤 buscar dados reais do utilizador
  async function fetchUser() {
    try {
      const res = await api.get(`/estudantes/${userLocal.id}`);
      setUser(res.data);
    } catch (error) {
      console.log("Erro user:", error.message);
    }
  }

  // 📦 buscar objetos
  async function fetchObjetos() {
    try {
      const res = await api.get("/objetos");
      setObjetos(res.data);
    } catch (error) {
      console.log("Erro objetos:", error.message);
    }
  }

  // 🔥 filtrar objetos do utilizador
  const meusObjetos = objetos.filter(
    (o) => o.estudante_id === userLocal?.id
  );

  const total = meusObjetos.length;

  const encontrados = meusObjetos.filter(
    (o) => o.status === "Encontrado" || o.tipo === "Encontrado"
  ).length;

  const perdidos = meusObjetos.filter(
    (o) => o.status === "Pendente" || o.tipo === "Perdido"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      {/* CABEÇALHO */}
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Perfil do Estudante
        </h1>

        <p className="text-gray-500 mt-2">
          Informações e atividade do utilizador
        </p>
      </div>

      {/* CARD UTILIZADOR */}
      <div className="flex justify-center px-4">

        <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-md">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                Dados do Utilizador
              </h2>

              <p><strong>Nome:</strong> {user?.nome}</p>
              <p><strong>Número:</strong> {user?.numero_estudante}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Contacto:</strong> {user?.contacto}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                Estatísticas
              </h2>

              <p>📦 Total de reportes: <strong>{total}</strong></p>
              <p>🟢 Encontrados: <strong>{encontrados}</strong></p>
              <p>🔴 Perdidos: <strong>{perdidos}</strong></p>
            </div>

          </div>
        </div>
      </div>

      {/* HISTÓRICO */}
      <div className="px-6 mt-10 pb-12">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Histórico de Objetos Reportados
        </h2>

        {meusObjetos.length === 0 ? (
          <p className="text-gray-500">
            Nenhum objeto reportado ainda.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {meusObjetos.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
              >

                <h3 className="text-lg font-bold">
                  {item.titulo}
                </h3>

                <p className="text-gray-600 mt-2">
                  {item.descricao}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  📍 {item.local}
                </p>

                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                    item.tipo === "Perdido"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.tipo}
                </span>

              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}