import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { gerenteService } from "../services/gerente.service";
import { GerenteAuthPostRequestBody } from "../model/gerente.model";

const gerenteRouter = Router()

async function listar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const resultado = await gerenteService.listarPorEmpresa(empresaId);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
gerenteRouter.get('/listar', authMiddleware('manager'), listar)

async function autenticarGerente(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const body = req.body as GerenteAuthPostRequestBody
    const resultado = await gerenteService.autenticar(empresaId, body.id, body.senha);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
gerenteRouter.post('/autenticar', authMiddleware('manager'), autenticarGerente)

async function encontrar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const id = req.params.id as string
    const resultado = await gerenteService.encontrar(empresaId, id);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
gerenteRouter.get('/encontrar/:id', authMiddleware('manager'), encontrar)

export default gerenteRouter;