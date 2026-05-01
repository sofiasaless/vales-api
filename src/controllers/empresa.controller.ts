import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { enterpriseService } from "../services/enterprise/enterprise.service";

const empresaRouter = Router();

async function encontrar(req: Request, res: Response) {
  try {
    const uid = req.user?.uid!;
    const result = await enterpriseService.find(uid);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}
empresaRouter.get("/encontrar", authMiddleware("manager"), encontrar);

async function listar(req: Request, res: Response) {
  try {
    const result = await enterpriseService.list();
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}
empresaRouter.get("/listar", authMiddleware("admin"), listar);

export default empresaRouter;
