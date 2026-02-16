import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { funcionarioService } from "../services/funcionario.service";
import { Funcionario, Vale } from "../model/funcionario.model";

const funcionarioRouter = Router()

async function criar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const body = req.body as Funcionario
    await funcionarioService.criar(empresaId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
funcionarioRouter.post('/criar', authMiddleware('manager'), criar)

async function listar(req: Request, res: Response) {
  try {
    const empresaId = req.user?.uid!
    const resultado = await funcionarioService.listar(empresaId);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
funcionarioRouter.get('/listar', authMiddleware('manager'), listar)

async function encontrar(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string
    const resultado = await funcionarioService.encontrar(idFuncionario);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
funcionarioRouter.get('/encontrar/:id', authMiddleware('manager'), encontrar)

async function adicionarVale(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string
    const body = req.body as Vale
    await funcionarioService.adicionarVale(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
funcionarioRouter.put('/vale/adicionar/:id', authMiddleware('manager'), adicionarVale)

async function adicionarMultiplosVales(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string
    const body = req.body as Vale[]
    await funcionarioService.adicionarMultiplosVales(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
funcionarioRouter.put('/vale/adicionar-multiplos/:id', authMiddleware('manager'), adicionarMultiplosVales)

async function removerVale(req: Request, res: Response) {
  try {
    const idFuncionario = req.params.id as string
    const body = req.body as Vale
    await funcionarioService.removerVale(idFuncionario, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
funcionarioRouter.put('/vale/remover/:id', authMiddleware('manager'), removerVale)

export default funcionarioRouter;