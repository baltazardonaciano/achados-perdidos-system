import { supabase } from "../config/supabase.js";

export async function criarUtilizador(req, res) {
  const {
    nome,
    numero_estudante,
    contacto,
    email,
    senha,
    role,
  } = req.body;

  const { data, error } = await supabase
    .from("estudantes")
    .insert([
      {
        nome,
        numero_estudante,
        contacto,
        email,
        senha,
        role,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  return res.status(201).json(data);
}