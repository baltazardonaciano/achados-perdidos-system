import { supabase } from "../config/supabase.js";

// 🔔 LISTAR NOTIFICAÇÕES
export async function getNotificacoes(req, res) {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}

// ✔ MARCAR COMO LIDA
export async function marcarComoLida(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}