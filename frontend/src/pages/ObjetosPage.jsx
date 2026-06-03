import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";
import { FaEye, FaCheck } from "react-icons/fa";

export default function ObjetosPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [categoriaFilter, setCategoriaFilter] = useState("Todas");

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageFullscreen, setImageFullscreen] = useState(null);

  const [reivindicados, setReivindicados] = useState([]);
  const [prova, setProva] = useState("");

  useEffect(() => {
    fetchObjetos();
    fetchReivindicacoes();
  }, []);

  async function fetchObjetos() {
    try {
      const res = await api.get("/objetos");
      setItems(res.data);
    } catch (error) {
      console.log("Erro ao buscar objetos:", error);
    }
  }

  async function fetchReivindicacoes() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get("/reivindicacoes");

      const minhas = res.data.filter(
        (r) => r.user_id === user?.id
      );

      setReivindicados(minhas);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleReivindicar(objeto_id) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!prova.trim()) {
        alert("Escreve a prova do objeto!");
        return;
      }

      await api.post("/reivindicacoes", {
        user_id: user?.id,
        objeto_id,
        mensagem: "Pedido de reivindicação",
        prova,
      });

      alert("Reivindicação enviada!");
      setProva("");
      fetchReivindicacoes();
    } catch (error) {
      console.log(error);
      alert("Erro ao reivindicar objeto");
    }
  }

  function jaReivindicado(objeto_id) {
    const user = JSON.parse(localStorage.getItem("user"));

    return reivindicados.some(
      (r) =>
        r.objeto_id === objeto_id &&
        r.user_id === user?.id &&
        r.status === "pendente"
    );
  }

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.titulo?.toLowerCase().includes(search.toLowerCase());

    const matchTipo =
      filter === "Todos" ? true : item.tipo === filter;

    const matchCategoria =
      categoriaFilter === "Todas"
        ? true
        : item.categoria === categoriaFilter;

    return matchSearch && matchTipo && matchCategoria;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HEADER */}
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold">
          Objetos Perdidos & Encontrados
        </h1>
      </div>

      {/* FILTROS */}
      <div className="px-6 mb-6">
        <div className="grid md:grid-cols-3 gap-3">

          <input
            type="text"
            placeholder="Pesquisar pelo nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border rounded-xl"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border rounded-xl"
          >
            <option value="Todos">Todos</option>
            <option value="Perdido">Perdidos</option>
            <option value="Encontrado">Encontrados</option>
          </select>

          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="p-3 border rounded-xl"
          >
            <option value="Todas">Todas Categorias</option>

            <optgroup label="🔌 Eletrónicos">
              <option value="Telemóvel">Telemóvel</option>
              <option value="Computador / Laptop">Computador / Laptop</option>
              <option value="Carregador">Carregador</option>
              <option value="Power Bank">Power Bank</option>
              <option value="Fones / Headset">Fones / Headset</option>
              <option value="Pen Drive">Pen Drive</option>
            </optgroup>

            <optgroup label="📚 Material Escolar">
              <option value="Mochila">Mochila</option>
              <option value="Cadernos">Cadernos</option>
              <option value="Livros">Livros</option>
              <option value="Pastas">Pastas</option>
              <option value="Canetas / Estojos">Canetas / Estojos</option>
              <option value="Calculadora">Calculadora</option>
            </optgroup>

            <optgroup label="📄 Documentos">
              <option value="Cartão de Estudante">Cartão de Estudante</option>
              <option value="Bilhete de Identidade">Bilhete de Identidade</option>
              <option value="Cartão Bancário">Cartão Bancário</option>
              <option value="Passaporte">Passaporte</option>
              <option value="Carta de Condução">Carta de Condução</option>
            </optgroup>

            <optgroup label="⌚ Acessórios">
              <option value="Carteira">Carteira</option>
              <option value="Relógio">Relógio</option>
              <option value="Óculos">Óculos</option>
              <option value="Chaves">Chaves</option>
              <option value="Jóias">Jóias</option>
            </optgroup>

            <optgroup label="👕 Vestuário">
              <option value="Casaco">Casaco</option>
              <option value="Camisola">Camisola</option>
              <option value="T-shirt">T-shirt</option>
              <option value="Sapatos">Sapatos</option>
              <option value="Boné">Boné</option>
            </optgroup>

            <optgroup label="📦 Outros">
              <option value="Outro">Outro</option>
            </optgroup>
          </select>

        </div>
      </div>

      {/* PROVA */}
      <div className="px-6 mb-6">
        <textarea
          placeholder="Descreve o objeto (prova)..."
          value={prova}
          onChange={(e) => setProva(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* LISTA */}
      <div className="px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredItems.map((item) => {
          const isDevolvido = item.status === "devolvido";
          const isReivindicado = jaReivindicado(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
            >

              {/* CARD */}
              <div className="flex gap-3">

                <div
                  className="w-20 h-24 bg-gray-200 rounded-md overflow-hidden cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
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
                  <h3 className="font-bold">{item.titulo}</h3>

                  <p className="text-sm text-gray-600">
                    {item.descricao}
                  </p>

                  <p className="text-xs text-gray-500">
                    📍 {item.local}
                  </p>

                  <p className="text-xs text-gray-500">
                    📅 {item.data_ocorrencia || "Sem data"}
                  </p>

                  <p className="text-xs text-gray-500">
                    👤 {item.criado_por_nome || "Sistema"}
                  </p>

                  <p className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {item.categoria}
                  </p>
                </div>
              </div>

              {/* BOTÃO DETALHES */}
              <button
                onClick={() => setSelectedItem(item)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl"
              >
                <FaEye /> Ver detalhes
              </button>

              {/* REIVINDICAR */}
              <div className="mt-2">
                {isDevolvido ? (
                  <button className="w-full bg-red-500 text-white py-2 rounded-xl">
                    Devolvido
                  </button>
                ) : isReivindicado ? (
                  <button className="w-full bg-gray-400 text-white py-2 rounded-xl">
                    Já reivindicado
                  </button>
                ) : (
                  <button
                    onClick={() => handleReivindicar(item.id)}
                    className="w-full bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Reivindicar
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL DETALHES */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">

            {selectedItem.imagem_url && (
              <img
                src={selectedItem.imagem_url}
                className="w-full h-56 object-cover rounded-xl mb-4 cursor-pointer"
                onClick={() =>
                  setImageFullscreen(selectedItem.imagem_url)
                }
              />
            )}

            <h2 className="text-xl font-bold mb-3">
              {selectedItem.titulo}
            </h2>

            <p><b>Descrição:</b> {selectedItem.descricao}</p>
            <p><b>Categoria:</b> {selectedItem.categoria}</p>
            <p><b>Tipo:</b> {selectedItem.tipo}</p>
            <p><b>Local:</b> {selectedItem.local}</p>
            <p><b>Data:</b> {selectedItem.data_ocorrencia}</p>
            <p><b>Publicado por:</b> {selectedItem.criado_por_nome || "Sistema"}</p>
            <p><b>Status:</b> {selectedItem.status}</p>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-5 w-full bg-gray-700 text-white py-2 rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE */}
      {imageFullscreen && (
        <div
          onClick={() => setImageFullscreen(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        >
          <img
            src={imageFullscreen}
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}