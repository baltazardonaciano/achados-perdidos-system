import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminUtilizadoresPage() {
  const navigate = useNavigate();

  // 🔐 PROTEÇÃO DE ACESSO
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "funcionario")) {
      alert("Acesso negado!");
      navigate("/home");
    }
  }, []);

  const [form, setForm] = useState({
    nome: "",
    numero_estudante: "",
    contacto: "",
    email: "",
    senha: "",
    role: "aluno",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/utilizadores", form);

      alert("Utilizador criado com sucesso!");

      setForm({
        nome: "",
        numero_estudante: "",
        contacto: "",
        email: "",
        senha: "",
        role: "aluno",
      });
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
        "Erro ao criar utilizador"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Cadastro de Utilizadores
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Nome"
            required
            value={form.nome}
            onChange={(e) =>
              setForm({ ...form, nome: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Número de estudante"
            required
            value={form.numero_estudante}
            onChange={(e) =>
              setForm({ ...form, numero_estudante: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Contacto"
            value={form.contacto}
            onChange={(e) =>
              setForm({ ...form, contacto: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            required
            value={form.senha}
            onChange={(e) =>
              setForm({ ...form, senha: e.target.value })
            }
            className="w-full border p-3 rounded"
          />

          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full border p-3 rounded"
          >
            <option value="aluno">Aluno</option>
            <option value="funcionario">Funcionário</option>
            <option value="admin">Administrador</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Criar Utilizador
          </button>

        </form>
      </div>
    </div>
  );
}