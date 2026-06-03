import express from "express";

import {
  cadastro,
  login
} from "../controllers/authController.js";

const router = express.Router();

// cadastro
router.post("/cadastro", cadastro);

// login
router.post("/login", login);

export default router;