import express from "express";
import {
  getEstudanteById,
  updateEstudante
} from "../controllers/estudantesController.js";

const router = express.Router();

// 👤 GET PERFIL
router.get("/:id", getEstudanteById);

// ✏️ UPDATE PERFIL
router.put("/:id", updateEstudante);

export default router;