import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { gerenteService } from "../services/gerente.service";

const gerenteRouter = Router()

async function encontrarPorEmpresa(req: Request, res: Response) {
  try {
    const userId = req.user?.uid!
    const resultado = await gerenteService.encontrarPorEmpresa(userId);
    res.status(200).json(resultado)
  } catch (error: any) {
    res.sendStatus(400).json({ message: error.message })
  }
}
gerenteRouter.get('/encontrar', authMiddleware('manager'), encontrarPorEmpresa)

export default gerenteRouter;