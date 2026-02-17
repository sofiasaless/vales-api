import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { pagamentoService } from "../services/pagamento.service";
import { Pagamento, PagamentosFiltroData } from "../model/pagamento.model";

const pagamentoRouter = Router()

async function criar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const funcionarioId = req.params.id as string
    const body = req.body as Pagamento
    await pagamentoService.criar(empresaId, funcionarioId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
pagamentoRouter.post('/pagar/:id', authMiddleware('manager'), criar)

async function listar(req: Request, res: Response) {
  try {
    const funcionarioId = req.params.id as string
    const body = req.body as PagamentosFiltroData
    const resultado = await pagamentoService.listarFiltrado(funcionarioId, body);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
pagamentoRouter.post('/listar/:id', authMiddleware('manager'), listar)

export default pagamentoRouter