import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { incentivoService } from "../services/incentive/incentivos.service";
import { Incentivo } from "../model/incentivo.model";

const incentivoRouter = Router();

async function criar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!;
    const body = req.body as Incentivo;
    const resultado = await incentivoService.criar(empresaId, body);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
incentivoRouter.post("/criar", authMiddleware("manager"), criar);

async function listar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!;
    const resultado = await incentivoService.listar(empresaId);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
incentivoRouter.get("/listar", authMiddleware("manager"), listar);
