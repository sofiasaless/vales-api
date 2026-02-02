"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurante_controller_1 = __importDefault(require("./controllers/restaurante.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// verificação de atividade
app.get("/health", (req, res) => res.json({ ok: true }));
// rotas
app.use("/api/restaurante", restaurante_controller_1.default);
exports.default = app;
