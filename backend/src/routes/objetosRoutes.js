import express from "express";
import multer from "multer";

import {
  getObjetos,
  getObjetoById,
  createObjeto,
} from "../controllers/objetosController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// GET todos
router.get("/", getObjetos);

// GET por id
router.get("/:id", getObjetoById);

// POST com imagem
router.post(
  "/",
  upload.single("imagem"), // TEM de ser "imagem"
  createObjeto
);

export default router;