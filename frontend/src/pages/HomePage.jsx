import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaEye } from "react-icons/fa";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);        // TODOS objetos
  const [recentes, setRecentes] = useState([]);  // só recentes

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function fetchData() {
    try {
      const res = await api.get("/objetos");
      const data = res.data;

      setItems(data); // 🔥 TODOS OS OBJETOS

      const ultimos = [...data]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6);

      setRecentes(ultimos); // 🔥 SÓ OS RECENTES
    } catch (error) {
      console.log(error);
    }
  }

  const filteredItems = recentes.filter((item) =>
    item.titulo.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 ESTATÍSTICAS CORRETAS
  const devolvidos = items.filter(i => i.status === "devolvido").length;
  const pendentes = items.filter(i => i.status !== "devolvido").length;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      {/* HERO */}
      <section className="text-center py-12 px-4">

        <h2 className="text-4xl font-bold text-gray-800">
          Sistema Inteligente de Achados & Perdidos
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Plataforma oficial do ISPT para registo, pesquisa e recuperação de objetos perdidos e encontrados.
        </p>

        <div className="mt-6 flex justify-center gap-4">

          <button
            onClick={() => navigate("/objetos")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Procurar Objetos
          </button>

        </div>
      </section>

      {/* PESQUISA */}
      <div className="px-6 mb-8">

        <input
          type="text"
          placeholder="Pesquisar objeto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* ESTATÍSTICAS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h3 className="text-4xl font-bold text-blue-600">
            {items.length}
          </h3>
          <p className="text-gray-600 mt-2">Objetos Totais</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h3 className="text-4xl font-bold text-green-600">
            {devolvidos}
          </h3>
          <p className="text-gray-600 mt-2">Devolvidos</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h3 className="text-4xl font-bold text-red-600">
            {pendentes}
          </h3>
          <p className="text-gray-600 mt-2">Pendentes</p>
        </div>

      </section>

      {/* OBJETOS RECENTES */}
      <section className="px-6 pb-12">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Objetos Recentes
          </h2>

          <button
            onClick={() => navigate("/objetos")}
            className="text-blue-600 hover:underline"
          >
            Ver todos
          </button>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300"
            >

              <div className="flex gap-3">

                <div className="w-20 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  {item.imagem_url ? (
                    <img
                      src={item.imagem_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="flex-1">

                  <h3 className="text-lg font-bold text-gray-800">
                    {item.titulo}
                  </h3>

                  <p className="text-gray-600 text-sm mt-1">
                    {item.descricao?.slice(0, 60)}...
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    📍 {item.local}
                  </p>

                </div>

              </div>

              <button
                onClick={() => navigate(`/objetos?id=${item.id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 
                           bg-blue-600 text-white py-2 rounded-xl 
                           hover:bg-blue-700 transition"
              >
                <FaEye />
                Ver detalhes
              </button>

            </div>
          ))}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-5">
        <p>© 2026 - Sistema de Achados & Perdidos ISPT</p>
      </footer>

    </div>
  );
}