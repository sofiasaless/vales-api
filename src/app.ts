import express from "express";
import empresaAuthRoutes from "./controllers/empresa.auth.controller";
import gerenteRouter from "./controllers/gerente.controller";
import { corsConfig } from "./config/cors";

const app = express();

app.use(corsConfig);
app.use(express.json());

// verificação de atividade
app.get("/health", (req, res) => res.json({ ok: true }));

// rotas
app.use("/api/auth/empresa", empresaAuthRoutes);
app.use("/api/gerente", gerenteRouter)

export default app;