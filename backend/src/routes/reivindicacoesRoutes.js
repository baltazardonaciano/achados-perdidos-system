import express from "express";
import {
  criarReivindicacao,
  listarReivindicacoes,
  aprovarReivindicacao,
  rejeitarReivindicacao,
  cancelarReivindicacao,
} from "../controllers/reivindicacoesController.js";

const router = express.Router();

// 📌 CRIAR
router.post("/", criarReivindicacao);

// 📌 LISTAR
router.get("/", listarReivindicacoes);

// 📌 APROVAR
router.put("/aprovar/:id", aprovarReivindicacao);

// 📌 REJEITAR
router.put("/rejeitar/:id", rejeitarReivindicacao);

// 📌 CANCELAR (USUÁRIO)
router.delete("/cancelar/:id", cancelarReivindicacao);

export default router;