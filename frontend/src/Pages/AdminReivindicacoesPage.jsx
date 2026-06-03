import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function AdminReivindicacoesPage() {
  const [reivindicacoes, setReivindicacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchReivindicacoes();
    fetchObjetos();
  }, []);

  // 📥 REIVINDICAÇÕES
  async function fetchReivindicacoes() {
    try {
      const res = await api.get("/reivindicacoes");
      setReivindicacoes(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // 📥 OBJETOS
  async function fetchObjetos() {
    try {
      await api.get("/objetos");
    } catch (error) {
      console.log(error);
    }
  }

  // ✅ APROVAR
  async function aprovar(id) {
    try {
      await api.put(`/reivindicacoes/aprovar/${id}`);

      alert("Reivindicação aprovada com sucesso!");

      fetchReivindicacoes();
      fetchObjetos();
    } catch (error) {
      console.log(error);
      alert("Erro ao aprovar reivindicação");
    }
  }

  // ❌ REJEITAR
  async function rejeitar(id) {
    try {
      await api.put(`/reivindicacoes/rejeitar/${id}`);

      alert("Rejeição feita com sucesso!");

      fetchReivindicacoes();
      fetchObjetos();
    } catch (error) {
      console.log(error);
      alert("Erro ao rejeitar reivindicação");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HEADER */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold">
          Painel de Reivindicações
        </h1>

        <p className="text-gray-500">
          Gestão completa de pedidos de objetos
        </p>
      </div>

      {/* LISTA */}
      <div className="px-6 grid gap-4">

        {loading ? (
          <p className="text-center">A carregar...</p>
        ) : reivindicacoes.length === 0 ? (
          <p className="text-center">Nenhuma reivindicação encontrada</p>
        ) : (
          reivindicacoes.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-xl shadow">

              {/* ALUNO */}
              <p><b>Aluno:</b> {r.estudantes?.nome}</p>
              <p><b>Número:</b> {r.estudantes?.numero_estudante}</p>
              <p><b>Contacto:</b> {r.estudantes?.contacto}</p>

              {/* OBJETO */}
              <p className="mt-2"><b>Objeto:</b> {r.objetos?.titulo}</p>
              <p><b>Tipo:</b> {r.objetos?.tipo}</p>
              <p><b>Local:</b> {r.objetos?.local}</p>

              {/* 🔥 NOVO: PROVA DO ESTUDANTE */}
              <p className="mt-2 text-blue-700">
                <b>Prova do aluno:</b> {r.prova || "Não informada"}
              </p>

              {/* STATUS */}
              <p className="mt-2">
                <b>Status:</b>{" "}
                <span
                  className={
                    r.status?.toLowerCase() === "pendente"
                      ? "text-yellow-600 font-bold"
                      : r.status?.toLowerCase() === "aprovada"
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {r.status}
                </span>
              </p>

              {/* BOTÕES */}
              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => setModal(r)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Detalhes
                </button>

                {r.status?.toLowerCase() === "pendente" && (
                  <>
                    <button
                      onClick={() => aprovar(r.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Aprovar
                    </button>

                    <button
                      onClick={() => rejeitar(r.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Rejeitar
                    </button>
                  </>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Detalhes completos
            </h2>

            {/* ALUNO */}
            <p><b>Aluno:</b> {modal.estudantes?.nome}</p>
            <p><b>Número:</b> {modal.estudantes?.numero_estudante}</p>
            <p><b>Contacto:</b> {modal.estudantes?.contacto}</p>

            {/* OBJETO */}
            <p className="mt-3"><b>Objeto:</b> {modal.objetos?.titulo}</p>
            <p><b>Descrição:</b> {modal.objetos?.descricao}</p>
            <p><b>Local:</b> {modal.objetos?.local}</p>

            {/* 🔥 NOVO */}
            <p className="mt-3 text-blue-700">
              <b>Prova do aluno:</b> {modal.prova || "Não informada"}
            </p>

            {/* IMAGEM */}
            {modal.objetos?.imagem_url && (
              <img
                src={modal.objetos.imagem_url}
                alt="Objeto"
                className="mt-3 rounded-lg w-full"
              />
            )}

            {/* MENSAGEM */}
            <p className="mt-3">
              <b>Mensagem:</b> {modal.mensagem}
            </p>

            <button
              onClick={() => setModal(null)}
              className="mt-5 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded w-full"
            >
              Fechar
            </button>

          </div>

        </div>
      )}
    </div>
  );
}