import { Request, Response, Router } from "express";
import { empresaAuthService } from "../services/empresa.auth.service";
import { Role } from "../types/roles.type";

const empresaAuthRoutes = Router()

async function definirClaim(req: Request, res: Response) {
  try {
    const uid = req.params.uid as string
    const role = req.params.role as Role
    const result = await empresaAuthService.setClaims(uid, role);
    res.status(200).json({ resposta: result?'ok':'error' })
  } catch (error: any) {
    console.error(error)
    res.sendStatus(400).json({ message: error.message })
  }
}
empresaAuthRoutes.put("/claims/:uid/:role", definirClaim)

export default empresaAuthRoutes