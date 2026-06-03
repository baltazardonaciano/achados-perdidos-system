import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// 🔥 ROTAS
import objetosRoutes from "./routes/objetosRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import notificacoesRoutes from "./routes/notificacoesRoutes.js";
import estudantesRoutes from "./routes/estudantesRoutes.js";
import reivindicacoesRoutes from "./routes/reivindicacoesRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

// 🆕 UTILIZADORES
import utilizadoresRoutes from "./routes/utilizadoresRoutes.js";

const app = express();

// 🔥 MIDDLEWARES
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// 🔥 ROTAS DA APLICAÇÃO
app.use("/estudantes", estudantesRoutes);
app.use("/objetos", objetosRoutes);
app.use("/auth", authRoutes);
app.use("/notificacoes", notificacoesRoutes);
app.use("/reivindicacoes", reivindicacoesRoutes);
app.use("/login", loginRoutes);

// 🆕 UTILIZADORES
app.use("/utilizadores", utilizadoresRoutes);

// 🔥 ROTA TESTE
app.get("/", (req, res) => {
  res.send("API do Sistema de Achados & Perdidos a funcionar 🚀");
});

// 🟢 PORTA (IMPORTANTE PARA RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});