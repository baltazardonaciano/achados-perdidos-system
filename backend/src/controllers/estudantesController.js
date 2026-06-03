import { supabase } from "../config/supabase.js";

// 👤 BUSCAR PERFIL DO UTILIZADOR
export async function getEstudanteById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("estudantes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}

// ✏️ ATUALIZAR PERFIL DO UTILIZADOR
export async function updateEstudante(req, res) {
  const { id } = req.params;
  const { nome, contacto, email } = req.body;

  const { data, error } = await supabase
    .from("estudantes")
    .update({
      nome,
      contacto,
      email
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}