import { Request, Response, Router } from "express";
import { RestaurantePostRequestBody } from "../model/restaurante.model";
import { authService } from "../services/auth.service";
import { Role } from "../types/roles.type";
import { AdminUser } from "../model/admin.model";
import { authMiddleware } from "../auth/authMiddleware";

const authRoutes = Router()

async function definirClaim(req: Request, res: Response) {
  try {
    const uid = req.params.uid as string
    const role = req.params.role as Role
    const result = await authService.setClaims(uid, role);
    res.status(200).json({ resposta: result?'ok':'error' })
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}
authRoutes.put("/claims/:uid/:role", authMiddleware('admin'), definirClaim)

async function criar(req: Request, res: Response) {
  try {
    const body = req.body as RestaurantePostRequestBody
    await authService.criarEmpresa(body);
    res.sendStatus(200);
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}
authRoutes.post("/cadastrar", authMiddleware('admin'), criar)

async function criarAdmin(req: Request, res: Response) {
  try {
    const body = req.body as AdminUser
    await authService.criarAdmin(body);
    res.sendStatus(200);
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}
authRoutes.post("/cadastrar-admin", authMiddleware('admin'), criarAdmin)

async function gerarTokenAdmin(req: Request, res: Response) {
  try {
    const body = req.body as { email: string, senha: string }
    const resultado = await authService.gerarTokenAdmin(body);
    res.status(200).json({ token: resultado });
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}
authRoutes.post("/gerar-token", gerarTokenAdmin)

export default authRoutes;