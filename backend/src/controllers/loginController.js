import { supabase } from "../config/supabase.js";

// 🔐 LOGIN COM ROLE
export async function login(req, res) {
  const { numero_estudante, senha } = req.body;

  if (!numero_estudante || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  // 🔎 procurar utilizador
  const { data: user, error } = await supabase
    .from("estudantes")
    .select("*")
    .eq("numero_estudante", numero_estudante)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: "Utilizador não encontrado" });
  }

  // 🔐 verificar senha (simples)
  if (user.senha !== senha) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  // ✅ LOGIN OK
  return res.json({
    id: user.id,
    nome: user.nome,
    role: user.role,
    numero_estudante: user.numero_estudante,
  });
}