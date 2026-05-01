import { HttpStatusCode } from "axios";
import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authService } from "../services/auth/auth.service";
import { CreateAuthUserDto } from "../services/auth/dto/authUserDto";
import { Role } from "../types/roles.type";
import { CreateAuthEnterpriseDto } from "../services/enterprise/dto/createEnterpriseDto";

const authRoutes = Router();

async function definirClaim(req: Request, res: Response) {
  try {
    const uid = req.params.uid as string;
    const role = req.params.role as Role;
    // const result = await authService.setClaims(uid, role);
    // res.status(200).json({ resposta: result ? "ok" : "error" });
  } catch (error: any) {
    console.error(error);
    res.sendStatus(400).json({ message: error.message });
  }
}
authRoutes.put("/claims/:uid/:role", authMiddleware("admin"), definirClaim);

async function criar(req: Request, res: Response) {
  try {
    const body = req.body as CreateAuthEnterpriseDto;
    await authService.createEnterprise(body);
    res.sendStatus(HttpStatusCode.Created);
  } catch (error: any) {
    console.error(error);
    res.sendStatus(400).json({ message: error.message });
  }
}
authRoutes.post("/cadastrar", authMiddleware("admin"), criar);

async function criarAdmin(req: Request, res: Response) {
  try {
    const body = req.body as CreateAuthUserDto;
    await authService.createAdminUser(body);
    res.sendStatus(HttpStatusCode.Created);
  } catch (error: any) {
    console.error(error);
    res.sendStatus(400).json({ message: error.message });
  }
}
authRoutes.post("/cadastrar-admin", authMiddleware("admin"), criarAdmin);

async function gerarTokenAdmin(req: Request, res: Response) {
  try {
    const body = req.body as { email: string; password: string };
    const resultado = await authService.generateAdminToken(body);
    res.status(HttpStatusCode.Ok).json({ token: resultado });
  } catch (error: any) {
    console.error(error);
    res.sendStatus(400).json({ message: error.message });
  }
}
authRoutes.post("/gerar-token", gerarTokenAdmin);

async function desativarEmpresa(req: Request, res: Response) {
  try {
    const empresaId = req.params.empresaId as string;
    const status = req.params.status === "desativar";
    await authService.updateEnterpriseStatus(empresaId, status);
    res.sendStatus(HttpStatusCode.Accepted);
  } catch (error: any) {
    console.error(error);
    res.sendStatus(400).json({ message: error.message });
  }
}
authRoutes.put("/atividade-empresa/:empresaId/:status", desativarEmpresa);

export default authRoutes;
