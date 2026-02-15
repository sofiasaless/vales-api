import express from "express";
import { corsConfig } from "./config/cors";
import empresaAuthRoutes from "./controllers/empresa.auth.controller";
import empresaRouter from "./controllers/empresa.controller";
import gerenteRouter from "./controllers/gerente.controller";
import funcionarioRouter from "./controllers/funcionario.controller";

const app = express();

app.use(corsConfig);
app.use(express.json());

// verificação de atividade
app.get("/health", (req, res) => res.json({ ok: true }));

// rotas
app.use("/api/auth/empresa", empresaAuthRoutes);
app.use("/api/gerente", gerenteRouter);
app.use("/api/empresa", empresaRouter);
app.use("/api/funcionario", funcionarioRouter)

export default app;