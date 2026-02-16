import express from "express";
import { corsConfig } from "./config/cors";
import empresaAuthRoutes from "./controllers/empresa.auth.controller";
import empresaRouter from "./controllers/empresa.controller";
import funcionarioRouter from "./controllers/funcionario.controller";
import gerenteRouter from "./controllers/gerente.controller";
import menuRouter from "./controllers/menu.controller";

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
app.use("/api/menu", menuRouter)

export default app;