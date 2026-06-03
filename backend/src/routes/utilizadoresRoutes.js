import express from "express";

import {
  criarUtilizador,
} from "../controllers/utilizadoresController.js";

const router = express.Router();

router.post("/", criarUtilizador);

export default router;