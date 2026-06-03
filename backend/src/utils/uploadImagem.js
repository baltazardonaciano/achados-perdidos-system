import { supabase } from "../config/supabase.js";

export async function uploadImagem(file) {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("objetos")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("objetos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}