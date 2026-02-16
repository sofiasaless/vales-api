import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { menuService } from "../services/menu.service";
import { ItemMenu } from "../model/menu.type";

const menuRouter = Router()

async function listar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const resultado = await menuService.listar(empresaId);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
menuRouter.get('/listar', authMiddleware('manager'), listar)

async function adicionar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const body = req.body as ItemMenu
    const resultado = await menuService.adicionar(empresaId, body);
    res.sendStatus(201)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
menuRouter.post('/adicionar', authMiddleware('manager'), adicionar)

async function atualizar(req: Request, res: Response) {
  try {
    const itemId = req.params.id as string
    const body = req.body as ItemMenu
    await menuService.atualizar(itemId, body);
    res.sendStatus(200)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
menuRouter.put('/atualizar/:id', authMiddleware('manager'), atualizar)

async function remover(req: Request, res: Response) {
  try {
    const itemId = req.params.id as string
    await menuService.remover(itemId);
    res.sendStatus(204)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
menuRouter.delete('/remover/:id', authMiddleware('manager'), remover)

export default menuRouter