import { supabase } from "../config/supabase.js";

// CADASTRAR ESTUDANTE
export async function cadastro(req, res) {
  const {
    nome,
    numero_estudante,
    contacto,
    email,
    senha
  } = req.body;

  const { data, error } = await supabase
    .from("estudantes")
    .insert([
      {
        nome,
        numero_estudante,
        contacto,
        email,
        senha
      }
    ])
    .select();

  if (error) {
    return res.status(400).json({
      error: error.message
    });
  }

  return res.status(201).json(data);
}

// LOGIN
export async function login(req, res) {
  const {
    numero_estudante,
    senha
  } = req.body;

  const { data, error } = await supabase
    .from("estudantes")
    .select("*")
    .eq("numero_estudante", numero_estudante)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    return res.status(401).json({
      error: "Credenciais inválidas"
    });
  }

  return res.json(data);
}