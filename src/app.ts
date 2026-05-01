import express from "express";
import { corsConfig } from "./config/cors";
import empresaRouter from "./controllers/enterprise.controller";
import funcionarioRouter from "./controllers/employee.controller";
import gerenteRouter from "./controllers/internUser.controller";
import menuRouter from "./controllers/menu.controller";
import pagamentoRouter from "./controllers/pagamento.controller";
import mensalidadeRouter from "./controllers/mensalidade.controller";
import authRoutes from "./controllers/auth.controller";

const app = express();

app.use(corsConfig);
app.use(express.json());

// verificação de atividade
app.get("/health", (req, res) => res.json({ ok: true }));

// rotas
app.use("/api/auth", authRoutes);
app.use("/api/gerente", gerenteRouter);
app.use("/api/empresa", empresaRouter);
app.use("/api/funcionario", funcionarioRouter);
app.use("/api/menu", menuRouter);
app.use("/api/pagamento", pagamentoRouter);
app.use("/api/mensalidade", mensalidadeRouter);

export default app;
