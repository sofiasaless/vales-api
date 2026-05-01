import { Request, Response, Router } from "express";
import { authMiddleware } from "../auth/authMiddleware";
import { menuService } from "../services/menu/menu.service";
import { CreateMenuItemDto } from "../services/menu/dto/createMenuItem.dto";

const menuRouter = Router();

async function findMany(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const result = await menuService.list(enterpriseId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
menuRouter.get("/listar", authMiddleware("manager"), findMany);

async function createOne(req: Request, res: Response) {
  try {
    const enterpriseId = req.user?.uid!;
    const body = req.body as CreateMenuItemDto;
    await menuService.create(enterpriseId, body);
    res.sendStatus(201);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
menuRouter.post("/adicionar", authMiddleware("manager"), createOne);

async function updateOne(req: Request, res: Response) {
  try {
    const itemId = req.params.id as string;
    const body = req.body as CreateMenuItemDto;
    await menuService.update(itemId, body);
    res.sendStatus(200);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
menuRouter.put("/atualizar/:id", authMiddleware("manager"), updateOne);

async function deleteOne(req: Request, res: Response) {
  try {
    const itemId = req.params.id as string;
    await menuService.delete(itemId);
    res.sendStatus(204);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
menuRouter.delete("/remover/:id", authMiddleware("manager"), deleteOne);

export default menuRouter;
