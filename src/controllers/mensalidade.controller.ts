import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { Mensalidade } from "../model/mensalidade.model";
import { mensalidadeService } from "../services/mensalidade.service";
import { HttpStatusCode } from "axios";

const mensalidadeRouter = Router();

async function criar(req: Request, res: Response) {
  try {
    const empresaId = req.params.empresaId as string;
    const body = req.body as Mensalidade;
    await mensalidadeService.criar(empresaId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
mensalidadeRouter.post("/criar/:empresaId", authMiddleware("manager"), criar);

async function listar(req: Request, res: Response) {
  try {
    let empresaId = "";
    if (req.query.empresaId) {
      empresaId = req.query.empresaId as string;
    } else {
      empresaId = req.user?.uid!;
    }
    const resultado = await mensalidadeService.listar(empresaId);
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
mensalidadeRouter.get("/listar", authMiddleware("manager"), listar);

async function atualizar(req: Request, res: Response) {
  try {
    const idMenslaidade = req.params.id as string;
    const body = req.body as Mensalidade;
    await mensalidadeService.atualizar(idMenslaidade, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
mensalidadeRouter.put("/atualizar/:id", authMiddleware("manager"), atualizar);

async function confirmarPagamento(req: Request, res: Response) {
  try {
    const idMensalidade = req.params.id as string;
    await mensalidadeService.confirmarPagamento(idMensalidade);
    res.sendStatus(HttpStatusCode.Ok);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
mensalidadeRouter.put(
  "/confirmar-pagamento/:id",
  authMiddleware("admin"),
  confirmarPagamento,
);

export default mensalidadeRouter;
