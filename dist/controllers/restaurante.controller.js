"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restauranteRoutes = (0, express_1.Router)();
async function listarEmpresas(req, res) {
    try {
        res.status(200).json({ resposta: "Listando empresas" });
    }
    catch (error) {
        console.error(error);
        res.sendStatus(400).json({ message: error.message });
    }
}
restauranteRoutes.get("/listar", listarEmpresas);
exports.default = restauranteRoutes;
