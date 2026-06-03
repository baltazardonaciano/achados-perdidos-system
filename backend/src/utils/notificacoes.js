import { supabase } from "../config/supabase.js";

export async function criarNotificacao(user_id, mensagem) {
  await supabase.from("notificacoes").insert([
    {
      user_id,
      mensagem,
      lida: false,
    },
  ]);
}