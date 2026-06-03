import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/ispt.png";
import api from "../services/api";

export default function LoginPage() {
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!numero || !senha) {
      alert("Preenche todos os campos!");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        numero_estudante: numero,
        senha: senha,
      });

      const user = res.data;

      // guardar utilizador no sistema
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login realizado com sucesso!");

      // redirecionamento por role
      if (user.role === "admin" || user.role === "funcionario") {
        navigate("/admin/reivindicacoes");
      } else {
        navigate("/home");
      }

    } catch (error) {
      console.log(error);
      alert("Número ou senha inválidos!");
    }
  }

  function handleClear() {
    setNumero("");
    setSenha("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* LOGO */}
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="ISPT Logo"
            className="w-20 h-20 mx-auto mb-3 object-contain"
          />

          <h1 className="text-xl font-bold text-gray-800">
            ISPT - Achados & Perdidos
          </h1>

          <p className="text-sm text-gray-500">
            Sistema de acesso institucional
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">
              Número de identificação
            </label>

            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ex: 2026ISPT001"
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div className="flex gap-3">

            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Limpar
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}