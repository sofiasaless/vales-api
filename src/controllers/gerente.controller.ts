import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { gerenteService } from "../services/gerente.service";
import { Gerente, GerenteAuthPostRequestBody } from "../model/gerente.model";

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

async function criar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const body = req.body as Gerente
    const resultado = await gerenteService.criar(empresaId, body);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
gerenteRouter.post('/criar', authMiddleware('manager'), criar)

async function excluir(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const gerenteId = req.params.id as string
    await gerenteService.excluir(empresaId, gerenteId);
    res.sendStatus(200)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
gerenteRouter.delete('/excluir/:id', authMiddleware('manager'), excluir)

async function atualizar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const gerenteId = req.params.id as string
    const payload = req.body as Partial<Gerente>
    await gerenteService.atualizar(empresaId, gerenteId, payload);
    res.sendStatus(200)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
gerenteRouter.put('/atualizar/:id', authMiddleware('manager'), atualizar)

export default gerenteRouter;