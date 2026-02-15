import { Request, Response, Router } from "express";
import { empresaService } from "../services/empresa.service";
import { authMiddleware } from "../auth/authMiddleware";

const empresaRouter = Router()

async function encontrar(req: Request, res: Response) {
  try {
    const uid = req.user?.uid!
    const result = await empresaService.encontrar(uid);
    res.status(200).json(result)
  } catch (error: any) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}
empresaRouter.get("/encontrar", authMiddleware('manager'), encontrar)

export default empresaRouter