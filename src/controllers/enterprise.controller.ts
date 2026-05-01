import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { enterpriseService } from "../services/enterprise/enterprise.service";

const enterpriseRouter = Router();

async function findOne(req: Request, res: Response) {
  try {
    const uid = req.user?.uid!;
    const result = await enterpriseService.find(uid);
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}
enterpriseRouter.get("/encontrar", authMiddleware("manager"), findOne);

async function findMany(req: Request, res: Response) {
  try {
    const result = await enterpriseService.list();
    res.status(200).json(result);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}
enterpriseRouter.get("/listar", authMiddleware("admin"), findMany);

export default enterpriseRouter;
