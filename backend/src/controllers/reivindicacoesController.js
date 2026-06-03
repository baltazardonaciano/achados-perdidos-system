import { supabase } from "../config/supabase.js";

// 📌 CRIAR REIVINDICAÇÃO (COM PROVA)
export async function criarReivindicacao(req, res) {
  const { user_id, objeto_id, mensagem, prova } = req.body;

  if (!prova) {
    return res.status(400).json({
      error: "É obrigatório descrever a prova do objeto"
    });
  }

  const { data, error } = await supabase
    .from("reivindicacoes")
    .insert([
      {
        user_id,
        objeto_id,
        mensagem,
        prova, // 🔥 NOVO CAMPO
        status: "pendente",
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json(data);
}


// 📌 LISTAR REIVINDICAÇÕES (ADMIN)
export async function listarReivindicacoes(req, res) {
  const { data, error } = await supabase
    .from("reivindicacoes")
    .select(`
      id,
      mensagem,
      prova,
      status,
      created_at,
      user_id,
      objeto_id,
      estudantes (
        nome,
        numero_estudante,
        contacto
      ),
      objetos (
        titulo,
        descricao,
        local,
        categoria,
        imagem_url,
        status
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  return res.json(data);
}


// 📌 APROVAR REIVINDICAÇÃO
export async function aprovarReivindicacao(req, res) {
  const { id } = req.params;

  const { data: reivindicacao, error: err1 } = await supabase
    .from("reivindicacoes")
    .select("*")
    .eq("id", id)
    .single();

  if (err1) return res.status(500).json({ error: err1.message });

  const { error: err2 } = await supabase
    .from("reivindicacoes")
    .update({ status: "aprovada" })
    .eq("id", id);

  if (err2) return res.status(500).json({ error: err2.message });

  const { error: err3 } = await supabase
    .from("objetos")
    .update({ status: "devolvido" })
    .eq("id", reivindicacao.objeto_id);

  if (err3) return res.status(500).json({ error: err3.message });

  await supabase.from("notificacoes").insert([
    {
      user_id: reivindicacao.user_id,
      mensagem: "✅ A tua reivindicação foi APROVADA. O objeto foi devolvido.",
    },
  ]);

  return res.json({
    message: "Reivindicação aprovada com sucesso",
    objeto_status: "devolvido",
  });
}


// 📌 REJEITAR REIVINDICAÇÃO
export async function rejeitarReivindicacao(req, res) {
  const { id } = req.params;

  const { data: reivindicacao, error: err1 } = await supabase
    .from("reivindicacoes")
    .select("*")
    .eq("id", id)
    .single();

  if (err1) return res.status(500).json({ error: err1.message });

  const { error: err2 } = await supabase
    .from("reivindicacoes")
    .update({ status: "rejeitada" })
    .eq("id", id);

  if (err2) return res.status(500).json({ error: err2.message });

  await supabase.from("notificacoes").insert([
    {
      user_id: reivindicacao.user_id,
      mensagem: "❌ A tua reivindicação foi REJEITADA.",
    },
  ]);

  return res.json({
    message: "Rejeição realizada com sucesso",
  });
}


// 🚀 CANCELAR REIVINDICAÇÃO
export async function cancelarReivindicacao(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("reivindicacoes")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.json({
    message: "Reivindicação cancelada com sucesso",
    data,
  });
}