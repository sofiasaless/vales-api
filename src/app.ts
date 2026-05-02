import express from "express";
import { corsConfig } from "./config/cors";
import menuRouter from "./controllers/menu.controller";
import authRoutes from "./controllers/auth.controller";
import paymentRouter from "./controllers/payment.controller";
import invoiceRouter from "./controllers/invoice.controller";
import internUserRouter from "./controllers/internUser.controller";
import enterpriseRouter from "./controllers/enterprise.controller";
import employeeRouter from "./controllers/employee.controller";

const app = express();

app.use(corsConfig);
app.use(express.json());

// verificação de atividade
app.get("/health", (req, res) => res.json({ ok: true }));

// rotas
app.use("/api/auth", authRoutes);
app.use("/api/gerente", internUserRouter);
app.use("/api/empresa", enterpriseRouter);
app.use("/api/funcionario", employeeRouter);
app.use("/api/menu", menuRouter);
app.use("/api/pagamento", paymentRouter);
app.use("/api/mensalidade", invoiceRouter);

export default app;
