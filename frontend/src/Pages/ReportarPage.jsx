import Navbar from "../components/Navbar";
import { useState } from "react";
import api from "../services/api";

export default function ReportarPage() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("Encontrado");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  const [mensagem, setMensagem] = useState("");

  function handleImagem(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagem(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // ✔ validação correta
    if (!titulo || !descricao || !categoria || !local) {
      alert("Preenche os campos obrigatórios!");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("categoria", categoria);
      formData.append("tipo", tipo);
      formData.append("local", local);
      formData.append("data_ocorrencia", data);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      const res = await api.post("/objetos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("RESPOSTA:", res.data);

      setMensagem("✅ Objeto registado com sucesso!");

      // limpar campos
      setTitulo("");
      setDescricao("");
      setCategoria("");
      setTipo("Encontrado");
      setLocal("");
      setData("");
      setImagem(null);
      setPreview(null);

    } catch (error) {
      console.log("ERRO COMPLETO:", error.response?.data || error.message);

      setMensagem(
        error.response?.data?.error || "❌ Erro ao reportar objeto!"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="text-center py-8">
        <h1 className="text-3xl font-bold">
          Registar Objeto (Admin / Funcionário)
        </h1>
      </div>

      <div className="flex justify-center px-4 pb-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg space-y-6"
        >

          {/* TÍTULO */}
          <input
            placeholder="Título do objeto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="p-3 border rounded-lg w-full"
          />

          {/* DESCRIÇÃO */}
          <textarea
            placeholder="Descrição detalhada do objeto"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {/* CATEGORIA AGRUPADA */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="p-3 border rounded-lg w-full"
          >
            <option value="">Selecione a categoria</option>

            {/* ELETRÓNICOS */}
            <optgroup label="🔌 Eletrónicos">
              <option value="Telemóvel">Telemóvel</option>
              <option value="Computador">Computador / Laptop</option>
              <option value="Carregador">Carregador</option>
              <option value="Power Bank">Power Bank</option>
              <option value="Fones">Fones / Headset</option>
              <option value="Pen Drive">Pen Drive</option>
            </optgroup>

            {/* MATERIAL ESCOLAR */}
            <optgroup label="📚 Material Escolar">
              <option value="Mochila">Mochila</option>
              <option value="Cadernos">Cadernos</option>
              <option value="Livros">Livros</option>
              <option value="Pastas">Pastas</option>
              <option value="Canetas">Canetas / Estojos</option>
              <option value="Calculadora">Calculadora</option>
            </optgroup>

            {/* DOCUMENTOS */}
            <optgroup label="📄 Documentos">
              <option value="Cartão de Estudante">Cartão de Estudante</option>
              <option value="BI">Bilhete de Identidade</option>
              <option value="Cartão Bancário">Cartão Bancário</option>
              <option value="Passaporte">Passaporte</option>
              <option value="Carta de Condução">Carta de Condução</option>
            </optgroup>

            {/* ACESSÓRIOS */}
            <optgroup label="⌚ Acessórios Pessoais">
              <option value="Carteira">Carteira</option>
              <option value="Relógio">Relógio</option>
              <option value="Óculos">Óculos</option>
              <option value="Chaves">Chaves</option>
              <option value="Jóias">Jóias</option>
            </optgroup>

            {/* VESTUÁRIO */}
            <optgroup label="👕 Vestuário">
              <option value="Casaco">Casaco</option>
              <option value="Camisola">Camisola</option>
              <option value="T-shirt">T-shirt</option>
              <option value="Sapatos">Sapatos</option>
              <option value="Boné">Boné</option>
            </optgroup>

            {/* OUTROS */}
            <optgroup label="📦 Outros">
              <option value="Outro">Outro</option>
            </optgroup>

          </select>

          <div className="grid md:grid-cols-2 gap-3">

            {/* TIPO */}
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="p-3 border rounded-lg"
            >
              <option value="Encontrado">Encontrado</option>
              <option value="Perdido">Perdido</option>
            </select>

            {/* LOCAL */}
            <input
              placeholder="Local onde foi encontrado"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="p-3 border rounded-lg"
            />

            {/* DATA */}
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </div>

          {/* IMAGEM */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImagem}
          />

          {preview && (
            <img
              src={preview}
              className="w-40 h-40 object-cover rounded-lg"
            />
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Registar Objeto
          </button>

          {/* MENSAGEM */}
          {mensagem && (
            <p className="text-center font-semibold">
              {mensagem}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}