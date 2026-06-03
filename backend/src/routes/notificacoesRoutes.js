import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// 🔔 buscar notificações do utilizador
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("notificacoes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      message: "Erro ao buscar notificações",
      error: error.message,
    });
  }

  return res.status(200).json(data);
});

// ✔ marcar como lida
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("notificacoes")
    .update({ lida: true })
    .eq("id", id)
    .select()
    .single(); // 🔥 garante retorno correto

  if (error) {
    return res.status(500).json({
      message: "Erro ao atualizar notificação",
      error: error.message,
    });
  }

  return res.status(200).json(data);
});

export default router;