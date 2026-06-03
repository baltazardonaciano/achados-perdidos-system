import { supabase } from "../config/supabase.js";
import { uploadImagem } from "../utils/uploadImagem.js";

// 📌 LISTAR OBJETOS
export async function getObjetos(req, res) {
  const { data, error } = await supabase
    .from("objetos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}

// 📌 VER OBJETO POR ID
export async function getObjetoById(req, res) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("objetos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}

// 📌 CRIAR OBJETO + IMAGEM + NOTIFICAÇÃO 🔥 FINAL
export async function createObjeto(req, res) {
  try {
    const {
      estudante_id,
      titulo,
      descricao,
      categoria,
      tipo,
      local,
      data_ocorrencia,
    } = req.body;

    let imagem_url = null;

    // 📸 Upload da imagem (MULTER)
    if (req.file) {
      imagem_url = await uploadImagem(req.file);
    }

    // 📦 Criar objeto no Supabase
    const { data: objeto, error } = await supabase
      .from("objetos")
      .insert([
        {
          estudante_id,
          titulo,
          descricao,
          categoria,
          tipo,
          local,
          data_ocorrencia,
          imagem_url,
          status: "Pendente",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // 🔔 Criar notificação (não quebra sistema se falhar)
    try {
      if (estudante_id) {
        await supabase.from("notificacoes").insert([
          {
            user_id: estudante_id,
            mensagem: `📦 Novo objeto "${titulo}" foi adicionado ao sistema`,
            lida: false,
          },
        ]);
      }
    } catch (err) {
      console.log("Erro ao criar notificação:", err.message);
    }

    return res.status(201).json(objeto);

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}