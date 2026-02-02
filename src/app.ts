import express from "express";
import restauranteRoutes from "./controllers/restaurante.controller";

const app = express();

app.use(express.json());

// verificação de atividade
app.get("/health", (req, res) => res.json({ ok: true }));

// rotas
app.use("/api/restaurante", restauranteRoutes);

export default app;